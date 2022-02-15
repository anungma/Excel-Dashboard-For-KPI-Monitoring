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

async function GetRegion2G (request, reply) {
	// let token = request.headers.authorization;
	// let check = await header.check(token, reply);
	 let strtdate =request.query.startdate;

	 console.log('strtdate:' + strtdate);
	 
	 let sql = SqlString.format("SELECT	distinct `region` " +
			   "FROM `cnsdb`.`2gkpihour` " +
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

 
async function GetCluster2G (request, reply) {
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
	 
	 let sql = SqlString.format("SELECT	distinct `region`, `BSC` " +
			   "FROM `cnsdb`.`2gkpihour` " +
			   region_x +
			   "ORDER BY BSC ASC" , [region]); 
 
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
						 result += `    "BSC":"` + row.BSC + `"\n`;
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

async function GetKPI2G (request, reply) {
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

    let sql = SqlString.format("SELECT	A.`region`,	A.`BSC`,	" +
			"A.datetime_id,	" +
			"DATE_FORMAT(A.datetime_id,'%Y-%m-%d') as date,	" +
			"TIME_FORMAT(A.datetime_id,'%k')  AS `time`,	" +
			"B.Val  AS `exetime`,	" +
			"`TBF_EST_SUC_DL`, `SDCCH_Success_Rate`, " +
			"`T_CONG`, `S_CONG`, `TCH_DR`, `TBF_Completion_Rate`, " +
			"`HOT_SUC`,	" +
			"`DATA_PAYLOAD_MB`, `T_TRAF`,	" +
			"`EGPRS_THROUGHPUT_DL`,	" +
			"`T_AVAIL`	" +
			"FROM 	`cnsdb`.`2gkpihour` AS A "  +
			"LEFT JOIN `cnsdb`.`aktivity` AS B "  +
			"ON A.`datetime_id`= B.`datetime_id` AND "  +
			"A.`region` = B.`region` AND "  +
			"A.`BSC` = B.`cluster` "  +
			"WHERE (date BETWEEN ? AND ?) AND A.region =? AND A.BSC=? " +
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
						result += `    "BSC":"` + row.BSC + `",\n`;
						result += `    "date":"` + row.date + `",\n`;
						result += `    "time":"` + row.time + `",\n`;
						result += `    "exetime":"` + row.exetime + `",\n`;
						result += `    "TBF_EST_SUC_DL":"` + row.TBF_EST_SUC_DL + `",\n`;
						result += `    "SDCCH_Success_Rate":"` + row.SDCCH_Success_Rate + `",\n`;
						result += `    "T_CONG":"` + row.T_CONG + `"\n`;
						result += `    "S_CONG":"` + row.S_CONG + `"\n`;
						result += `    "TCH_DR":"` + row.TCH_DR + `"\n`;
						result += `    "TBF_Completion_Rate":"` + row.TBF_Completion_Rate + `"\n`;
						result += `    "HOT_SUC":"` + row.HOT_SUC + `"\n`;
						result += `    "DATA_PAYLOAD_GB":"` + row.DATA_PAYLOAD_MB + `"\n`;
						result += `    "T_TRAF":"` + row.T_TRAF + `"\n`;
						result += `    "EGPRS_THROUGHPUT_DL":"` + row.EGPRS_THROUGHPUT_DL + `"\n`;
						result += `    "T_AVAIL":"` + row.T_AVAIL + `"\n`;

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
    GetKPI2G, GetRegion2G, GetCluster2G
};

