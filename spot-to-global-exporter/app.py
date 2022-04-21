import argparse
import os
import time
from datetime import datetime

from locallib.logger import SystemLogger
from locallib.exporter import Exporter
from locallib.file_handler import FileHanlder

def main():
    logger = SystemLogger(name="main", debug_enabled=True)

    parser = argparse.ArgumentParser()
    required_argumenst = parser.add_argument_group("required arguments")
    required_argumenst.add_argument("--host", type=str, dest="host", default="",
                                    help="(string) - c8db host address")
    required_argumenst.add_argument("--port", type=int, dest="port",
                                    help="(int) - c8db port number")
    required_argumenst.add_argument("--batch-size", type=int, dest="batch_size", default=25*1024*1024,
                                    help="(int) - maximum size for individual data batches")
    required_argumenst.add_argument("--write-dir", type=str, dest="write_dir", default="",
                                    help="(string) - destination directory in which to write all files")
    required_argumenst.add_argument("--write-iterations", type=int, dest="write_iterations", default=200,
                                    help="(int) - maximum size of one file")
    required_argumenst.add_argument("--collection", type=str, dest="collection", default="",
                                    help="(string) - name of the collection")
    required_argumenst.add_argument("--bucket", type=int, dest="bucket", default=0,
                                    help="(int) - last exported bucket")
    required_argumenst.add_argument("--fabric", type=str, dest="fabric", default="_system",
                                    help="(string) - fabric name")

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
 
    all_arguments = parser.parse_args()
    if (
        not all_arguments.write_dir or
        not all_arguments.collection or
        not all_arguments.host or
        not all_arguments.username or
        not all_arguments.password
    ):
        logger.error(
            "invalid input arguments. Use --help for more details")

        return

    logger.info("starting application")
    start_time = datetime.now()

    if not os.path.exists(all_arguments.write_dir):
        logger.info("create dir:" + all_arguments.write_dir)
        os.mkdir(all_arguments.write_dir)

    username = all_arguments.username 
    password = all_arguments.password
    logger.info("username --> " + username)
    print("username --> " + username)
    logger.info("password --> " + password)
    print("password --> " + password)

    exporter = Exporter(all_arguments.host,all_arguments.internalc8db,all_arguments.port,
                        username, password,
                        all_arguments.fabric, all_arguments.new_tenant ,
                        all_arguments.collection,all_arguments.protocol, all_arguments.batch_size)

    file_handler = FileHanlder(
        all_arguments.write_dir, all_arguments.collection, all_arguments.write_iterations)

    exporter.authenticate()
    exporter.create_batch()

    while True:
        (data, has_more, last_included) = exporter.get_data()

        if last_included < all_arguments.bucket:
            logger.info(f"skipping bucket: {last_included}")

            continue

        if last_included > all_arguments.bucket:
            file_handler.write_to_file(content=data)

        logger.info("Get data. Has more: " + str(has_more) +
                    ", Bucket: " + str(last_included))

        if not has_more:
            break

        if all_arguments.sleep:
            logger.debug(f"sleep {all_arguments.sleep} before next export")
            time.sleep(all_arguments.sleep)

    exporter.delete_batch()
    file_handler.close_pointers()

    end_time = datetime.now()

    logger.info("closing application. Time spend: {}".format(
        end_time - start_time))

if __name__ == "__main__":
    main()
