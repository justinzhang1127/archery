/**
 * 运营预算申请流程
 * 第六次流程改造
 * 20220427
 * 正式版本
 */

$(document).ready(function(){
	let getScriptParam = function(paramName, defualtValue){
		let filename = "/yyyssqJS6.js";
		let scripts = document.scripts;
		for(let i=0;i<scripts.length;i++){
			let src = scripts[i].src;
			if(src){
				let index1 = src.indexOf(filename);
				if(index1>-1){
					let startIndex = src.indexOf(paramName + "=", index1);
					if(startIndex>-1){
						let endIndex = src.indexOf("&", startIndex);
						if(endIndex>-1) return src.substring(startIndex + (paramName + "=").length, endIndex);
						else return src.substring(startIndex + (paramName + "=").length);
					}
				}
			}
		}
		return defualtValue;
	}
	
	//以下只在创建节点执行
	let workflowid = -1;
	let nodeid = -1;
	let languageid = 7;
	if(WfForm){
		workflowid = WfForm.getBaseInfo().workflowid;
		nodeid = WfForm.getBaseInfo().nodeid;
		languageid = WfForm.getBaseInfo().languageid;
	}
	if(workflowid==parseInt(getScriptParam("wid", 0))&&nodeid==parseInt(getScriptParam("nid", 0))){
		//20220427001-START-奖励类型、奖励账户、发放系统关联币种
		{
			let fieldConfig = [
				{
					detailIndex: 1,
					fieldId_jllx: 9453,//奖励类型
					fieldId_jlzh: 9454,//奖励账户
					fieldId_ffxt: 9455,//发放系统
					fieldId_yhlqbz: 8923,//用户领取币种
				},
				{
					detailIndex: 2,
					fieldId_jllx: 9457,//奖励类型
					fieldId_jlzh: 9458,//奖励账户
					fieldId_ffxt: 9459,//发放系统
					fieldId_yhlqbz: 8939,//用户领取币种
				},
				{
					detailIndex: 3,
					fieldId_jllx: 9486,//奖励类型
					fieldId_jlzh: 9487,//奖励账户
					fieldId_ffxt: 9488,//发放系统
					fieldId_yhlqbz: 9490,//用户领取币种
				},
				{
					detailIndex: 4,
					fieldId_jllx: 13270,//奖励类型
					fieldId_jlzh: 13271,//奖励账户
					fieldId_ffxt: 13272,//发放系统
					fieldId_yhlqbz: 13274,//用户领取币种
				}
			];
			//jllx, 0-Bonus, 1-coupon, 2-discount, 3-Token/Airdrop, 4-APY booster, 5-Real prize/others, 6-NFT
			//jlzh, 0-Futures, 1-Byfi, 2-Others, 3-Spot, 4-Options
			//ffxt, 0-awar, 1-口领红包, 2-老卡券系统, 3-其他, 4-Platform Asset Distribution, 5-System Account, 6-Future Operation Platform
			let dataConfig = {
				"0_4_0":"52,USDC",
				"1_4_0":"52,USDC",
				"2_4_0":"52,USDC",
			}
			let fieldAttr = {};//字段属性历史
			let changeBzInfo = function(fieldConfigIndex, rowIndex){
				let fullFieldId_jllx = "field" + fieldConfig[fieldConfigIndex].fieldId_jllx + "_" + rowIndex;
				let fullFieldId_jlzh = "field" + fieldConfig[fieldConfigIndex].fieldId_jlzh + "_" + rowIndex;
				let fullFieldId_ffxt = "field" + fieldConfig[fieldConfigIndex].fieldId_ffxt + "_" + rowIndex;
				let fullFieldId_yhlqbz = "field" + fieldConfig[fieldConfigIndex].fieldId_yhlqbz + "_" + rowIndex;
				let fieldValue_jllx = WfForm.getFieldValue(fullFieldId_jllx);
				let fieldValue_jlzh = WfForm.getFieldValue(fullFieldId_jlzh);
				let fieldValue_ffxt = WfForm.getFieldValue(fullFieldId_ffxt);
				let key = fieldValue_jllx + "_" + fieldValue_jlzh + "_" + fieldValue_ffxt;
				if(dataConfig[key]){
					let bzInfo = dataConfig[key].split(",");
					fieldAttr[fullFieldId_yhlqbz] = WfForm.getFieldCurViewAttr(fullFieldId_yhlqbz);
					
					WfForm.changeFieldValue(fullFieldId_yhlqbz, {
						value: bzInfo[0],
						specialobj: [
							{id: bzInfo[0], name: bzInfo[1]}
						]
					});
					WfForm.changeFieldAttr(fullFieldId_yhlqbz, 1);
				}else{
					if(fieldAttr[fullFieldId_yhlqbz]){
						WfForm.changeFieldAttr(fullFieldId_yhlqbz, parseInt(fieldAttr[fullFieldId_yhlqbz]));
						fieldAttr[fullFieldId_yhlqbz] = undefined;
					}
				}
			};
			fieldConfig.map(function(fieldConfigItem, fieldConfigIndex){
				let rowIndexList = WfForm.getDetailAllRowIndexStr("detail_" + fieldConfigItem.detailIndex).split(",");
				for(let i=0;i<rowIndexList.length;i++){
					let rowIndex = rowIndexList[i];
					if(rowIndex!=""){
						let fieldValue_jllx = WfForm.getFieldValue("field" + fieldConfigItem.fieldId_jllx + "_" + rowIndex);
						let fieldValue_jlzh = WfForm.getFieldValue("field" + fieldConfigItem.fieldId_jlzh + "_" + rowIndex);
						let fieldValue_ffxt = WfForm.getFieldValue("field" + fieldConfigItem.fieldId_ffxt + "_" + rowIndex);
						let key = fieldValue_jllx + "_" + fieldValue_jlzh + "_" + fieldValue_ffxt;
						changeBzInfo(fieldConfigIndex, rowIndex);
					}
				}
			});
			fieldConfig.map(function(fieldConfigItem, fieldConfigIndex){
				WfForm.bindDetailFieldChangeEvent("field" + fieldConfigItem.fieldId_jllx + "," + "field" + fieldConfigItem.fieldId_jlzh + "," + "field" + fieldConfigItem.fieldId_ffxt, function(id,rowIndex,value){
					changeBzInfo(fieldConfigIndex, rowIndex);
				});
			});
		}
	}
});