let response = require('../response');
let connection = require('../connection');
let moment = require('moment');
let header = require('../helper/token');

SqlString = require('sqlstring');

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

async function GetRegion3G (request, reply) {
	// let token = request.headers.authorization;
	// let check = await header.check(token, reply);
	 let strtdate =request.query.startdate;

	 console.log('strtdate:' + strtdate);
	 
	 let sql = SqlString.format("SELECT	distinct `region` " +
			   "FROM `cnsdb`.`3gkpihour` " +
			   " ORDER BY region ASC" , [strtdate]); 
 
		 console.log('sql:', sql);
			  let data = await new Promise((resolve) => connection.query(sql, function (error, rows) {
			 if(error){
				 console.log('error:', error);
				 return response.badRequest('', `${error}`, reply)
			 }
 
			 if(rows.length > 0){
					 let numrow=0;
					 let result = `[\n`;               	
					 rows.forEach(function(row) {
						 numrow++
						 result += `  {\n`  
						 result += `    "region":"` + row.region + `"\n`;
						 if (numrow===rows.length){
							 result += `  }\n` 
						 }else{
							 result += `  },\n` 
						 }
 
					 });
					 result += `]` ;
					 return resolve(result);
			 }
			 else{
				 return resolve([]);
			 }
		 })
	 );
		 
		 return reply
		 .code(200)
		 .header('Content-Type', 'application/json; charset=utf-8')
		 .send(data);
 }
 // ============================================================

 
async function GetCluster3G (request, reply) {
	// let token = request.headers.authorization;
	// let check = await header.check(token, reply);
	 let strtdate =request.query.startdate;
	 let region =request.query.region;
	 
	 let region_x;

	 if (typeof region === 'undefined'){
		region_x=""
	 }else{
		region_x=" WHERE region = ? "
	 }


	 console.log('strtdate:' + strtdate);
	 console.log('region:' + region);
	 
	 let sql = SqlString.format("SELECT	distinct `region`, `RNC` " +
			   "FROM `cnsdb`.`3gkpihour` " +
			   region_x +
			   "ORDER BY RNC ASC" , [region]); 
 
		 console.log('sql:', sql);
			  let data = await new Promise((resolve) => connection.query(sql, function (error, rows) {
			 if(error){
				 console.log('error:', error);
				 return response.badRequest('', `${error}`, reply)
			 }
 
			 if(rows.length > 0){
					 let numrow=0;
					 let result = `[\n`;               	
					 rows.forEach(function(row) {
						 numrow++
						 result += `  {\n`  
						 result += `    "region":"` + row.region + `"\n`;
						 result += `    "RNC":"` + row.RNC + `"\n`;
						 if (numrow===rows.length){
							 result += `  }\n` 
						 }else{
							 result += `  },\n` 
						 }
 
					 });
					 result += `]` ;
					 return resolve(result);
			 }
			 else{
				 return resolve([]);
			 }
		 })
	 );
		 
		 return reply
		 .code(200)
		 .header('Content-Type', 'application/json; charset=utf-8')
		 .send(data);
 }
 // ============================================================

async function GetKPI3G (request, reply) {
   // let token = request.headers.authorization;
   // let check = await header.check(token, reply);
    let regionID = request.query.region;
	let clusterID = request.query.cluster;
    let strtdate =request.query.startdate;
	let durasi =request.query.durasi;

    console.log('regionID: ' + regionID);
    console.log('clusterID: ' + clusterID);
	console.log('strtdate: ' + strtdate);
	console.log('durasi: ' + durasi);
    
	let beginDate = new Date(strtdate);
	let endDate=new Date(new Date(beginDate).setDate(new Date(beginDate).getDate() + Number(durasi-1)));
	let endDateStr = formatDate(endDate);

	if (durasi=='1'){
		endDateStr=formatDate(beginDate);
	}

    let sql = SqlString.format("SELECT	A.`region`,	A.`RNC`,	" +
			"A.datetime_id,	" +
			"DATE_FORMAT(A.datetime_id,'%Y-%m-%d') as date,	" +
			"TIME_FORMAT(A.datetime_id,'%k')  AS `time`,	" +
			"B.Val  AS `exetime`,	" +
			"`CSSR_CS`, `CSSR_PS`, `CSSR_HS`, `CSSR_EUL`, `CCSR_CS`, `CCSR_PS`, `CCSR_HS`, `CCSR_EUL`," +
			"`SHO`, `IFHO`, " +
			"`Traffic_Speech`, `Payload_HS_GB`, `Payload_EUL_GB`, `Payload_DCH_DL_GB`, `Payload_DCH_UL_GB`, `Total_Payload_GB`, `Payload_Common_DL_GB`, `Payload_Common_UL_GB`, " +
			"`HS_User_throughput`,  `EUL_User_Throughput`, `HS_users`, `AV_AUTO` " +
			"FROM 	`cnsdb`.`3gkpihour` AS A "  +
			"LEFT JOIN `cnsdb`.`aktivity` AS B "  +
			"ON A.`datetime_id`= B.`datetime_id` AND "  +
			"A.`region` = B.`region` AND "  +
			"A.`RNC` = B.`cluster` "  +
			"WHERE (date BETWEEN ? AND ?) AND A.region =? AND A.RNC=? " +
			"ORDER BY A.datetime_id" , [strtdate, endDateStr, regionID, clusterID]); 

		console.log('sql:', sql);
		     let data = await new Promise((resolve) => connection.query(sql, function (error, rows) {
            if(error){
                console.log('error:', error);
                return response.badRequest('', `${error}`, reply)
            }

            if(rows.length > 0){
					let numrow=0;
					let result = `[\n`;               	
					rows.forEach(function(row) {
						numrow++
						result += `  {\n`  
						result += `    "region":"` + row.region + `",\n`;
						result += `    "RNC":"` + row.RNC + `",\n`;
						result += `    "date":"` + row.date + `",\n`;
						result += `    "time":"` + row.time + `",\n`;
						result += `    "exetime":"` + row.exetime + `",\n`;
						result += `    "CSSR_CS":"` + row.CSSR_CS + `",\n`;
						result += `    "CSSR_PS":"` + row.CSSR_PS + `",\n`;
						result += `    "CSSR_HS":"` + row.CSSR_HS + `"\n`;
						result += `    "CSSR_EUL":"` + row.CSSR_EUL + `"\n`;
						result += `    "CCSR_CS":"` + row.CCSR_CS + `"\n`;
						result += `    "CCSR_PS":"` + row.CCSR_PS + `"\n`;
						result += `    "CCSR_HS":"` + row.CCSR_HS + `"\n`;
						result += `    "CCSR_EUL":"` + row.CCSR_EUL + `"\n`;
						result += `    "SHO":"` + row.SHO + `"\n`;
						result += `    "IFHO":"` + row.IFHO + `"\n`;
						result += `    "Traffic_Speech":"` + row.Traffic_Speech + `"\n`;
						result += `    "Payload_HS_GB":"` + row.Payload_HS_GB + `"\n`;
						result += `    "Payload_EUL_GB":"` + row.Payload_EUL_GB + `"\n`;
						result += `    "Payload_DCH_DL_GB":"` + row.Payload_DCH_DL_GB + `"\n`;
						result += `    "Payload_DCH_UL_GB":"` + row.Payload_DCH_UL_GB + `"\n`;
						result += `    "Total_Payload_GB":"` + row.Total_Payload_GB + `"\n`;
						result += `    "Payload_Common_DL_GB":"` + row.Payload_Common_DL_GB + `"\n`;
						result += `    "Payload_Common_UL_GB":"` + row.Payload_Common_UL_GB + `"\n`;
						result += `    "HS_User_throughput":"` + row.HS_User_throughput + `"\n`;
						result += `    "EUL_User_Throughput":"` + row.EUL_User_Throughput + `"\n`;
						result += `    "HS_users":"` + row.HS_users + `"\n`;
						result += `    "AV_AUTO":"` + row.AV_AUTO + `"\n`;

						if (numrow===rows.length){
							result += `  }\n` 
						}else{
							result += `  },\n` 
						}

					});
					result += `]` ;
					return resolve(result);
            }
            else{
                return resolve([]);
            }
        })
    );
		
		return reply
		.code(200)
		.header('Content-Type', 'application/json; charset=utf-8')
        .send(data);
}
// ============================================================
// KPI 4g_agg_cell



module.exports = {
    GetKPI3G, GetRegion3G, GetCluster3G
};

