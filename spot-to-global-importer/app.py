import argparse
import os
import time
from datetime import datetime

from locallib.logger import SystemLogger
from locallib.importer import Importer
from locallib.file_handler import FileHanlder
from typing import Text
from c8 import C8Client
import requests
import json
import sys
import traceback
import pprint
from urllib3.exceptions import InsecureRequestWarning
import io


def main():
    global logger
    logger = SystemLogger(name="main", debug_enabled=True)

    parser = argparse.ArgumentParser()
    required_argumenst = parser.add_argument_group("required arguments")
    required_argumenst.add_argument("--host", type=str, dest="host", default="",
                                    help="(string) - c8db host address")
    required_argumenst.add_argument("--port", type=int, dest="port",
                                    help="(int) - c8db port number")
    required_argumenst.add_argument("--batch-size", type=int, dest="batch_size", default=8*1024*1024,
                                    help="(int) - maximum size for individual data batches")
    required_argumenst.add_argument("--source-dir", type=str, dest="source_dir", default=None,
                                    help="(string) - source directory containing all exported files")
    required_argumenst.add_argument("--old-collection", type=str, dest="old_collection", default="",
                                    help="(string) - name of the old collection")
    required_argumenst.add_argument("--new-collection", type=str, dest="new_collection", default="",
                                    help="(string) - name of the new collection")
    required_argumenst.add_argument("--fabric", type=str, dest="fabric", default="_system",
                                    help="(string) - fabric name")
    required_argumenst.add_argument("--file", type=str, dest="selected_single_file", default=None,
                                    help="(string) - file from which to import data")

    optional_arguments = parser.add_argument_group("optional arguments")
    optional_arguments.add_argument("--username", type=str, dest="username",
                                    help="(string) - username to use when connecting")
    optional_arguments.add_argument("--password", type=str, dest="password",
                                    help="(string) - password to use when connecting")
    optional_arguments.add_argument(
        "--sleep", type=int, dest="sleep", default=1, help="(int) - sleep time between export iterations in seconds")
    optional_arguments.add_argument("--protocol", type=str, dest="protocol", default="https",
                                    help="(string) - http or https")
    optional_arguments.add_argument("--internalc8db", dest="internalc8db", default=False,action='store_true',
                                    help="(bool) - True if 'api-' is not needed as a prefix for host name")
    optional_arguments.add_argument("--new-tenant", dest="new_tenant",type=str,
                                    help="(string) - Specify guest tenant")
    optional_arguments.add_argument("--replicate", type=str, dest="replicate", default="n",
                                    help="Should replicate after import?")
    
    all_arguments = parser.parse_args()
    if (
        not all_arguments.host or
        #not all_arguments.old_collection or
        not all_arguments.new_collection or
        not all_arguments.fabric or
        not all_arguments.username or
        not all_arguments.password
    ):
        logger.error(
            "invalid input arguments. Use --help for more details")

        return

    logger.info("starting application")
    start_time = datetime.now()

    file_handler = FileHanlder(all_arguments.source_dir, 
                               all_arguments.selected_single_file, all_arguments.batch_size)
    
    global shouldReplicate
    global initurl
    global federation
    global fabric
    global collection
    global username
    global password
    global acceptheader
    global tenant
    acceptheader = "application/json"
    username = all_arguments.username 
    password = all_arguments.password
    federation = all_arguments.host
    initurl =  'https://api-' + all_arguments.host
    shouldReplicate= all_arguments.replicate
    collection = all_arguments.new_collection
    fabric=all_arguments.fabric
    tenant=all_arguments.new_tenant
    logger.info("username ---> " + username)
    logger.info("password ---> " + password)

    importer = Importer(federation,all_arguments.internalc8db, all_arguments.port,
                        username, password,
                        collection, fabric, all_arguments.new_tenant ,all_arguments.protocol)

    while True:
        logger.info("start read data")
        data = file_handler.read_data()
        logger.info("end read data")
        if data == "" and not file_handler.more_data_is_available:
            logger.info("no more data")

            break

        logger.info("data read: {}".format(len(data)))
        logger.info("files remaining for read: \n{}".format(
            ", \n".join(file_handler.all_files_to_read_from)))
        
        data = data.replace('"_id":"' + all_arguments.old_collection +
                            '/', '"_id":"' + all_arguments.new_collection + '/')

        logger.info("data is send for import")
        importer.import_data(data)
        logger.info("data was imported")

        if all_arguments.sleep:
            logger.debug(f"sleep {all_arguments.sleep} before next export")
            time.sleep(all_arguments.sleep)


    end_time = datetime.now()

    logger.info("closing application. Time spend: {}".format(
        end_time - start_time))

def getCollectionDocumentCount(fed, collection):
    logger.info("Get collection documents count for " + collection)
    getDocumentCountUrl = f"https://api-{fed}/_fabric/{fabric}/_api/collection/{collection}/count"
    print(getDocumentCountUrl)
    try:
        result = requests.get(getDocumentCountUrl, headers={'Authorization': authheader, 'accept' : acceptheader }, verify=False)
        print(result.text)
        jsonCollectionDeatils = json.loads(result.text)
        logger.info(jsonCollectionDeatils["count"])
        return jsonCollectionDeatils["count"]

    except Exception as e:
        print("Error in getting collection document count")
        logger.error("Error occured in :getCollectionDocumentCount" + str(e) + ", Result:" + result.text)
        raise e

def replaceDocWithItself(collection):
    global origCount
    global origChecksum
    try:
        url = ""
        payload = ""
        migrated = 0
        cursorId = ""
        count = getCollectionDocumentCount(federation, collection)
        origCount = count
        logger.info(f"Current count for collection:[{collection}] is [{count}]")
        print(f"Current count for collection:[{collection}], Count:[{count}]")
        while migrated < count :
            try: 
                print(f"Procesing data: current record count:[{migrated}]")
                url = f"{initurl}/_fabric/{fabric}/_api/cursor"
                print(url)
                
                # Fire the POST cursor API witha query to replace 8000 ducuments in a collection
                # The C8QL query will replace the document with itsef and will publish the message
                # Other regions will replace the document with matching document with the source document if exist or else will create it.

                payload = "{\"batchSize\": 1000, \"query\": \"for d in " + collection + " sort d._key limit "+ str(migrated) + ", 8000 replace d in " + collection + "\"}"
                result = requests.post(url, data=payload, headers={'Authorization': authheader, 'accept' : acceptheader }, verify=False)
                logger.info(result.text)
                jsonCursoreResponse = json.loads(result.text)
                writes = jsonCursoreResponse["extra"]["stats"]["writesExecuted"]
                migrated = migrated + writes
                hasMore = str(jsonCursoreResponse["hasMore"])
            except Exception as e:
                logger.error("migrateLocalToGlobal: " + str(e))

    except Exception as e:
        print("Exception occured during replacement")
        logger.error("migrateLocalToGlobal: Error occured in processing database:" + str(e))

def getJWT():
    global jwtToken
    global authheader
    getAuthUrl = initurl + "/_open/auth"
    try:
        payload = "{\"email\":\"" + username + "\", \"password\":\"" + password + "\"}"
        result = requests.post(getAuthUrl, data=payload, headers={'accept' : acceptheader }, verify=False)
        jsonAuth = json.loads(result.text)
        logger.info(jsonAuth["jwt"])
        jwtToken = jsonAuth["jwt"]
        authheader = "bearer " + jwtToken

    except Exception as e:
        print("Error in getting token")
        logger.error("Error occured in :getJWT " + str(e) + "Result:" + result.text)

if __name__ == "__main__":
    main()
    if shouldReplicate == "y" :
        getJWT()
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        print(f"Collection:[{collection}], Start time:[{current_time}]")
        replaceDocWithItself(collection)
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        print(f"Collection:[{collection}], End time:[{current_time}]")


