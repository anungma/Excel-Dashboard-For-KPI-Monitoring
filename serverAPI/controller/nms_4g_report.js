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

async function GetRegion4G (request, reply) {
	// let token = request.headers.authorization;
	// let check = await header.check(token, reply);
	 let strtdate =request.query.startdate;

	 console.log('strtdate:' + strtdate);
	 
	 let sql = SqlString.format("SELECT	distinct `region` " +
			   "FROM `cnsdb`.`4ghour` " +
			   " WHERE (date_id >= ? )  ORDER BY region ASC" , [strtdate]); 
 
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

 
async function GetCluster4G (request, reply) {
	// let token = request.headers.authorization;
	// let check = await header.check(token, reply);
	 let strtdate =request.query.startdate;
	 let region =request.query.region;

	 console.log('strtdate:' + strtdate);
	 
	 let sql = SqlString.format("SELECT	distinct `region`, `cluster` " +
			   "FROM `cnsdb`.`4ghour` " +
			   " WHERE (date_id >= ? )  and region = ? " +
			   "ORDER BY cluster ASC" , [strtdate, region]); 
 
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
						 result += `    "cluster":"` + row.cluster + `"\n`;
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

async function GetKPI4G (request, reply) {
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

    let sql = SqlString.format("SELECT	A.`region`,	A.`cluster`,	" +
			"A.datetime_id,	" +
			"DATE_FORMAT(date_id,'%Y-%m-%d') as date,	" +
			"TIME_FORMAT(time_id,'%k')  AS `time`,	" +
			"B.Val  AS `exetime`,	" +
			"`erbs`,	`eutrancell`,	`session_setup_success_rate`, `rrc_setup_sr`, `erab_setup_sr`, "+
			"`session_abnormal_release`, "+
			"`intra_freq_hosr`, `inter_freq_hosr`, "+
			"`downlink_traffic_vol_mb`, `uplink_traffic_vol_mb`, `total_traffic_vol_mb`, "+
			"`avg_cqi`, `spectrum_eficiency`,"+
			"`dl_user_thp`, `ul_user_thp`,"+
			"`dl_rb_util`, `ul_rb_util`,"+
			"`avg_user_number_rrc`, "+
			"`radio_network_availability_rate` "+
  			"FROM 	`cnsdb`.`4ghour` AS A "  +
			"LEFT JOIN `cnsdb`.`aktivity` AS B "  +
			"ON A.`datetime_id`= B.`datetime_id` AND "  +
			"A.`region` = B.`region` AND "  +
			"A.`cluster` = B.`cluster` "  +
			"WHERE (Date_ID BETWEEN ? AND ?) AND A.region =? AND A.cluster=? " +
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
						result += `    "cluster":"` + row.cluster + `",\n`;
						result += `    "date":"` + row.date + `",\n`;
						result += `    "time":"` + row.time + `",\n`;
						result += `    "exetime":"` + row.exetime + `",\n`;
						result += `    "session_setup_success_rate":"` + row.session_setup_success_rate + `",\n`;
						result += `    "rrc_setup_sr":"` + row.rrc_setup_sr + `",\n`;
						result += `    "erab_setup_sr":"` + row.erab_setup_sr + `"\n`;
						result += `    "session_abnormal_release":"` + row.session_abnormal_release + `"\n`;
						result += `    "intra_freq_hosr":"` + row.intra_freq_hosr + `"\n`;
						result += `    "inter_freq_hosr":"` + row.inter_freq_hosr + `"\n`;
						result += `    "downlink_traffic_vol_mb":"` + row.downlink_traffic_vol_mb + `"\n`;
						result += `    "uplink_traffic_vol_mb":"` + row.uplink_traffic_vol_mb + `"\n`;
						result += `    "total_traffic_vol_mb":"` + row.total_traffic_vol_mb + `"\n`;
						result += `    "avg_cqi":"` + row.avg_cqi + `"\n`;
						result += `    "spectrum_eficiency":"` + row.spectrum_eficiency + `"\n`;
						result += `    "dl_user_thp":"` + row.dl_user_thp + `"\n`;
						result += `    "ul_user_thp":"` + row.ul_user_thp + `"\n`;
						result += `    "dl_rb_util":"` + row.dl_rb_util + `"\n`;
						result += `    "ul_rb_util":"` + row.ul_rb_util + `"\n`;
						result += `    "avg_user_number_rrc":"` + row.avg_user_number_rrc + `"\n`;
						result += `    "radio_network_availability_rate":"` + row.radio_network_availability_rate + `"\n`;

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
    GetKPI4G, GetRegion4G, GetCluster4G
};

