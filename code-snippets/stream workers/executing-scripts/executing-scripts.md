## Sample

@App:name('ProcessEmployeeData')
@App:qlVersion("2")

CREATE SOURCE CompanyXInputStream WITH (type = 'database', collection = "CompanyXInputStream", collection.type="doc" , replication.type="global", map.type='json') (seqNo string, name string, address string);


CREATE SINK CompanyXProfessionalInfo WITH (type = 'stream', stream = "CompanyXProfessionalInfo", replication.type="local") (name string, workAddress string);

CREATE FUNCTION getWorkAddress[javascript] return string {
    work_address = JSON.parse(data[0]).work
    formatted_address =  work_address.street + ", " + work_address.city + ", " + work_address.state + ", " + work_address.country + ", " + work_address.zip;
    return formatted_address
};

-- Data Processing
@info(name='Query')
insert into CompanyXProfessionalInfo
select name, getWorkAddress(address) as workAddress
from CompanyXInputStream;
