/**
 * 运营预算申请流程
 * 第四次流程改造
 * 20220411
 */

$(document).ready(function(){
	let getScriptParam = function(paramName, defualtValue){
		let filename = "/yyyssqJS4.js";
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
 	//所有节点都需要执行
	//20220419002-START-指标说明内容赋值
    {
      let fieldConfig = {
        detailIndex: 5,
        fieldId_zbsmnr: 15900, //指标说明内容
        fieldId_yyzb: 15899, //运营指标
      }
      WfForm.bindDetailFieldChangeEvent("field" + fieldConfig.fieldId_zbsmnr, function(id,rowIndex,value){
		let aimEle = $("#field" + fieldConfig.fieldId_yyzb + "_" + rowIndex).closest("td").next().find("span").eq(0);
        aimEle.attr("title", value);
		aimEle.css("cursor", "pointer");
      });
      let rowArr = WfForm.getDetailAllRowIndexStr("detail_" + fieldConfig.detailIndex).split(",");
      for(let i=0; i<rowArr.length; i++){
        let rowIndex = rowArr[i];
        if(rowIndex !== ""){
          let fieldValue_zbsmnr = WfForm.getFieldValue("field" + fieldConfig.fieldId_zbsmnr + "_" + rowIndex);
          let aimEle = $("#field" + fieldConfig.fieldId_yyzb + "_" + rowIndex).closest("td").next().find("span").eq(0);
	        aimEle.attr("title", fieldValue_zbsmnr);
			aimEle.css("cursor", "pointer");
        }
      }
    }
    //20220419002-END
	
	
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
		//20220411001-START-运营KPI字段值校验
	    {
	      let fieldConfig = {
	        fieldId_lx: 13740, //类型
			fieldId_cp: 13810, //产品
	        detailIndex: 5, //明细表索引
	        fieldId_yymb: 15897, //运营目标
	        fieldId_yyzb: 15899, //运营指标
	        fieldId_yykpi: 15901, //运营KPI
	        fieldId_cwkpi: 15902, //财务KPI
	        fieldId_cwkpidw: 15904, //财务KPI单位
	        fieldId_cwkpifh: 15903, //财务KPI符号
	        fieldId_cwkpi2: 15931, //财务KPI2
	        fieldId_cwkpidw2: 15933, //财务KPI单位2
	        fieldId_cwkpifh2: 15932, //财务KPI符号2
	      };
	      //主表类型_明细运营目标_明细运营指标: 运营KPI字段属性(1-只读, 2-编辑, 3-必填)_运营KPI数值类型(1-整数, 2-2位小数, 3-字符串)-财务指标字段属性_财务指标数值类型_财务指标数值单位
	      let relationShipConfig = {
	        "_0_": "1_-1__-1__",
	        "0_1_0,1,2,3": "2_1-2_1_0-1__",
	        "1_1_0,1,2,3": "3_1-3_1_0-1__",
	        "3_1,5_2,12": "3_1-1__-1__",
	        "2,4,5_1_0,1,2,3": "2_1-2_1_0-1__",
                        "6_1_0,1,2,3": "3_1-3_1_0-1__",
	        "_2_4,5": "3_1-3_1_0-1__",
	        "_2_6": "3_2-3_2_2,3-3_2_2,3",
	        "_3_7,8": "3_1-3_1_0-1__",
	        "_4_9": "3_2-3_2_2-3_2_3",
	        "_4_10": "3_1-3_1_0-1__",
	        "_5_11,12,13,14,15": "3_1-3_1_0-1__",
	        "_5_16": "3_2-3_2_1-1__",
	        "_6_17,18,19,20": "3_1-3_1_0-1__",
	        "_6_21,22,23": "3_2-3_2_1-1__",
	        "_7_24,25,26": "3_1-3_1_0-1__",
	        "_7_16": "3_2-3_2_1-1__",
	        "_8_27": "3_3-1__-1__",
	      };
	      //当明细的运营目标为做市费用时, 运营指标为只读, 否则必填, 此处单独只用一个配置
	      let relationShipConfigSpecial1 = {
	        "0": 1,
	        "non": 3,
	      };
	      let specialCondition = "3_3,4_1,5_2,12";//类型_产品_运营目标_运营指标
	      //获取满足条件的结果
	      let getResultWithCondition = function(v_lx, v_yymb, v_yyzb){
	        for(let condition in relationShipConfig){
	          let conditionPart = condition.split("_");
	          let cdt_lx = conditionPart[0];
	          let cdt_yymb = conditionPart[1];
	          let cdt_yyzb = conditionPart[2];
	          if(cdt_lx==""||cdt_lx.split(",").indexOf(v_lx+"")>-1){
	            if(cdt_yymb==""||cdt_yymb.split(",").indexOf(v_yymb+"")>-1){
	              if(cdt_yyzb==""||cdt_yyzb.split(",").indexOf(v_yyzb+"")>-1){
	                return relationShipConfig[condition];
	              }
	            }
	          }
	        }
	        return "";
	      };
	      //校验KPI的值
	      let checkKpiValue = function(result, v_kpi, isTip){
	        let flag = false;
	        if(result!=""){
	          let kpiType = result.split("-")[0].split("_")[1];
	          if(parseInt(kpiType)==1){//整数
	            if(!isNaN(v_kpi)&&parseInt(v_kpi)==v_kpi) flag = true;
	            if(!flag&&isTip) WfForm.showConfirm(languageid==7?"该字段必须为整数":"The field must be an integer");
	          }else if(parseInt(kpiType)==2){//2为小数
	            if(!isNaN(v_kpi)&&parseInt(v_kpi*100)==v_kpi*100) flag = true;
	            if(!flag&&isTip) WfForm.showConfirm(languageid==7?"该字段必须为2位小数":"The field must be two decimal places");
	          }else if(parseInt(kpiType)==3){
	            flag = true;
	          }
	        }
	        return flag;
	      };
	      //获取KPI属性
	      let getKpiFieldAttr = function(result){
	        let fa = [1, 1, 1];
	        if(result!=""){
	          let resultPart = result.split("-");
	          let rstAttr1 = resultPart[0].split("_")[0];
	          let rstAttr2 = resultPart[1].split("_")[0];
	          let rstAttr3 = resultPart[2].split("_")[0];
	          fa = [rstAttr1, rstAttr2, rstAttr3];
	        }
	        return fa;
	      }
	      //获取财务KPI单位可选值
	      let getCwKpiSelection = function(result){
	        let cwv = "";
	        if(result!=""){
	          cwv = result.split("-")[1].split("_")[2];
	        }
	        return cwv;
	      }
	      //获取财务KPI单位2可选值
	      let getCwKpiSelection2 = function(result){
	        let cwv = "";
	        if(result!=""){
	          cwv = result.split("-")[2].split("_")[2];
	        }
	        return cwv;
	      }
	      //获取财务KPI符号
	      let getCwKpiMark = function(result){
	        let cwfh = "";
	        if(result!=""){
	          v_cwfh = result.split("-")[1].split("_")[1];
	          if(v_cwfh=="1") cwfh = "USD";
	          else if(v_cwfh=="2") cwfh= "%";
	        }
	        return cwfh;
	      }
	      //获取财务KPI符号2
	      let getCwKpiMark2 = function(result){
	        let cwfh = "";
	        if(result!=""){
	          v_cwfh = result.split("-")[2].split("_")[1];
	          if(v_cwfh=="1") cwfh = "USD";
	          else if(v_cwfh=="2") cwfh= "%";
	        }
	        return cwfh;
	      }
	      //判断是否满足特殊场景条件
	      let isSpecialScene = function(v_lx, v_cp, v_yymb){
	        let conditionPart = specialCondition.split("_");
	        return conditionPart[0].split(",").indexOf(v_lx)>-1&&conditionPart[1].split(",").indexOf(v_cp)>-1&&conditionPart[2].split(",").indexOf(v_yymb)>-1&&conditionPart[3].split(",").indexOf(v_yyzb)>-1;
	      }
	      WfForm.bindDetailFieldChangeEvent("field" + fieldConfig.fieldId_yykpi, function(id,rowIndex,value){
	        if(value=="") return;
	        let fieldValue_lx = WfForm.getFieldValue("field" + fieldConfig.fieldId_lx);
	        let fieldValue_yymb = WfForm.getFieldValue("field" + fieldConfig.fieldId_yymb + "_" + rowIndex);
	        let fieldValue_yyzb = WfForm.getFieldValue("field" + fieldConfig.fieldId_yyzb + "_" + rowIndex);
	        if(!checkKpiValue(getResultWithCondition(fieldValue_lx, fieldValue_yymb, fieldValue_yyzb), value, true)){
	          setTimeout(function(){
	            WfForm.changeFieldValue(id + "_" + rowIndex, {value:""});
	          }, 10);
	        }
	      });
	      WfForm.bindFieldChangeEvent("field" + fieldConfig.fieldId_lx + ",field" + fieldConfig.fieldId_cp, function(obj,id,value){
	        let rowArr = WfForm.getDetailAllRowIndexStr("detail_" + fieldConfig.detailIndex).split(",");
	        let fieldValue_cp = WfForm.getFieldValue("field" + fieldConfig.fieldId_cp);
	        for(let i=0; i<rowArr.length; i++){
	          let rowIndex = rowArr[i];
	          if(rowIndex !== ""){
	            let fieldValue_yymb = WfForm.getFieldValue("field" + fieldConfig.fieldId_yymb + "_" + rowIndex);
	            let fieldValue_yyzb = WfForm.getFieldValue("field" + fieldConfig.fieldId_yyzb + "_" + rowIndex);
	            let fieldValue_yykpi = WfForm.getFieldValue("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex);
	            let resultStr = getResultWithCondition(value, fieldValue_yymb, fieldValue_yyzb);
	            if(!checkKpiValue(resultStr, fieldValue_yykpi, false)){
	              WfForm.changeFieldValue("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex, {value:""});
	            }
	            let fAttr = getKpiFieldAttr(resultStr);
	            WfForm.changeFieldAttr("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex, fAttr[0]);
	            WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpi + "_" + rowIndex, fAttr[1]);
	            WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, fAttr[1]);
	            if(fAttr[0]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex, {value:""});
	            if(fAttr[1]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpi + "_" + rowIndex, {value:""});
	            if(fAttr[1]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, {value:""});
	            WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpifh + "_" + rowIndex, {value:getCwKpiMark(resultStr)});
	            WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpi2 + "_" + rowIndex, fAttr[2]);
	            WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, fAttr[2]);
	            if(fAttr[2]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpi2 + "_" + rowIndex, {value:""});
	            if(fAttr[2]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, {value:""});
	            WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpifh2 + "_" + rowIndex, {value:getCwKpiMark2(resultStr)});
	            let cwv = getCwKpiSelection(resultStr)
	            WfForm.controlSelectOption("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, cwv);
	            if(cwv.split(",").indexOf(WfForm.getFieldValue("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex))==-1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, {value:""});
	            let cwv2 = getCwKpiSelection2(resultStr)
	            WfForm.controlSelectOption("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, cwv2);
	            if(cwv2.split(",").indexOf(WfForm.getFieldValue("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex))==-1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, {value:""});
	            if(isSpecialScene(value, fieldValue_cp, fieldValue_yymb)) {
//	              WfForm.changeFieldValue("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex, {value:""});
	              WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpi + "_" + rowIndex, {value:""});
	              WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, {value:""});
	              WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpifh + "_" + rowIndex, {value:""});
//	              WfForm.changeFieldAttr("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex, 1);
	              WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpi + "_" + rowIndex, 1);
	              WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, 1);
	              WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpi2 + "_" + rowIndex, {value:""});
	              WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, {value:""});
	              WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpifh2 + "_" + rowIndex, {value:""});
	              WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpi2 + "_" + rowIndex, 1);
	              WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, 1);
	            }
	          }
	        }
	      });
	      WfForm.bindDetailFieldChangeEvent("field" + fieldConfig.fieldId_yymb + ",field" + fieldConfig.fieldId_yyzb, function(id,rowIndex,value){
	        let fieldValue_lx = WfForm.getFieldValue("field" + fieldConfig.fieldId_lx);
	        let fieldValue_cp = WfForm.getFieldValue("field" + fieldConfig.fieldId_cp);
	        let fieldValue_yymb = WfForm.getFieldValue("field" + fieldConfig.fieldId_yymb + "_" + rowIndex);
	        let fieldValue_yyzb = WfForm.getFieldValue("field" + fieldConfig.fieldId_yyzb + "_" + rowIndex);
	        let fieldValue_yykpi = WfForm.getFieldValue("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex);
	        let resultStr = getResultWithCondition(fieldValue_lx, fieldValue_yymb, fieldValue_yyzb);
	        if(!checkKpiValue(resultStr, fieldValue_yykpi, false)){
	          WfForm.changeFieldValue("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex, {value:""});
	        }
	        let fAttr = getKpiFieldAttr(resultStr);
	        WfForm.changeFieldAttr("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex, fAttr[0]);
	        WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpi + "_" + rowIndex, fAttr[1]);
	        WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, fAttr[1]);
	        if(fAttr[0]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex, {value:""});
	        if(fAttr[1]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpi + "_" + rowIndex, {value:""});
	        if(fAttr[1]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, {value:""});
	        WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpifh + "_" + rowIndex, {value:getCwKpiMark(resultStr)});
	        WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpi2 + "_" + rowIndex, fAttr[2]);
	        WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, fAttr[2]);
	        if(fAttr[2]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpi2 + "_" + rowIndex, {value:""});
	        if(fAttr[2]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, {value:""});
	        WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpifh2 + "_" + rowIndex, {value:getCwKpiMark2(resultStr)});
	        let cwv = getCwKpiSelection(resultStr)
	        WfForm.controlSelectOption("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, cwv);
	        if(cwv.split(",").indexOf(WfForm.getFieldValue("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex))==-1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, {value:""});
	        let cwv2 = getCwKpiSelection2(resultStr)
	        WfForm.controlSelectOption("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, cwv2);
	        if(cwv2.split(",").indexOf(WfForm.getFieldValue("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex))==-1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, {value:""});
	        if(isSpecialScene(fieldValue_lx, fieldValue_cp, fieldValue_yymb)) {
//	          WfForm.changeFieldValue("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex, {value:""});
	          WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpi + "_" + rowIndex, {value:""});
	          WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, {value:""});
	          WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpifh + "_" + rowIndex, {value:""});
//	          WfForm.changeFieldAttr("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex, 1);
	          WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpi + "_" + rowIndex, 1);
	          WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, 1);
	          WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpi2 + "_" + rowIndex, {value:""});
	          WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, {value:""});
	          WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpifh2 + "_" + rowIndex, {value:""});
	          WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpi2 + "_" + rowIndex, 1);
	          WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, 1);
	        }
	      });
	      //relationShipConfigSpecial1配置的使用
	      WfForm.bindDetailFieldChangeEvent("field" + fieldConfig.fieldId_yymb, function(id,rowIndex,value){
	        let fAttr = relationShipConfigSpecial1[value];
	        if(fAttr){
	          WfForm.changeFieldAttr("field" + fieldConfig.fieldId_yyzb + "_" + rowIndex, fAttr);
	          if(fAttr==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_yyzb + "_" + rowIndex, {value:""});
	        }else{
	          WfForm.changeFieldAttr("field" + fieldConfig.fieldId_yyzb + "_" + rowIndex, relationShipConfigSpecial1["non"]);
	          if(relationShipConfigSpecial1["non"]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_yyzb + "_" + rowIndex, {value:""});
	        }
	      });
	      //初始化
	      let rowArr = WfForm.getDetailAllRowIndexStr("detail_" + fieldConfig.detailIndex).split(",");
	      let fieldValue_lx = WfForm.getFieldValue("field" + fieldConfig.fieldId_lx);
	      let fieldValue_cp = WfForm.getFieldValue("field" + fieldConfig.fieldId_cp);
	      for(let i=0; i<rowArr.length; i++){
	        let rowIndex = rowArr[i];
	        if(rowIndex !== ""){
	          let fieldValue_yymb = WfForm.getFieldValue("field" + fieldConfig.fieldId_yymb + "_" + rowIndex);
	          let fieldValue_yyzb = WfForm.getFieldValue("field" + fieldConfig.fieldId_yyzb + "_" + rowIndex);
	          let fieldValue_yykpi = WfForm.getFieldValue("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex);
	          let resultStr = getResultWithCondition(fieldValue_lx, fieldValue_yymb, fieldValue_yyzb);
	          if(!checkKpiValue(resultStr, fieldValue_yykpi, false)){
	            WfForm.changeFieldValue("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex, {value:""});
	          }
	          let fAttr = getKpiFieldAttr(resultStr);
	          WfForm.changeFieldAttr("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex, fAttr[0]);
	          WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpi + "_" + rowIndex, fAttr[1]);
	          WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, fAttr[1]);
	          if(fAttr[0]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex, {value:""});
	          if(fAttr[1]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpi + "_" + rowIndex, {value:""});
	          if(fAttr[1]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, {value:""});
	          WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpifh + "_" + rowIndex, {value:getCwKpiMark(resultStr)});
	          WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpi2 + "_" + rowIndex, fAttr[2]);
	          WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, fAttr[2]);
	          if(fAttr[2]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpi2 + "_" + rowIndex, {value:""});
	          if(fAttr[2]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, {value:""});
	          WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpifh2 + "_" + rowIndex, {value:getCwKpiMark2(resultStr)});
	          let cwv = getCwKpiSelection(resultStr)
	          WfForm.controlSelectOption("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, cwv);
	          if(cwv.split(",").indexOf(WfForm.getFieldValue("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex))==-1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, {value:""});
	          let cwv2 = getCwKpiSelection2(resultStr)
	          WfForm.controlSelectOption("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, cwv2);
	          if(cwv2.split(",").indexOf(WfForm.getFieldValue("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex))==-1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, {value:""});
	          if(isSpecialScene(fieldValue_lx, fieldValue_cp, fieldValue_yymb)) {
//	            WfForm.changeFieldValue("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex, {value:""});
	            WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpi + "_" + rowIndex, {value:""});
	            WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, {value:""});
	            WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpifh + "_" + rowIndex, {value:""});
//	            WfForm.changeFieldAttr("field" + fieldConfig.fieldId_yykpi + "_" + rowIndex, 1);
	            WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpi + "_" + rowIndex, 1);
	            WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpidw + "_" + rowIndex, 1);
	            WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpi2 + "_" + rowIndex, {value:""});
	            WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, {value:""});
	            WfForm.changeFieldValue("field" + fieldConfig.fieldId_cwkpifh2 + "_" + rowIndex, {value:""});
	            WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpi2 + "_" + rowIndex, 1);
	            WfForm.changeFieldAttr("field" + fieldConfig.fieldId_cwkpidw2 + "_" + rowIndex, 1);
	          }
	          //relationShipConfigSpecial1配置的初始化
	          let fAttr2 = relationShipConfigSpecial1[fieldValue_yymb];
	          if(fAttr2){
	            WfForm.changeFieldAttr("field" + fieldConfig.fieldId_yyzb + "_" + rowIndex, fAttr2);
	            if(fAttr2==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_yyzb + "_" + rowIndex, {value:""});
	          }else{
	            WfForm.changeFieldAttr("field" + fieldConfig.fieldId_yyzb + "_" + rowIndex, relationShipConfigSpecial1["non"]);
	            if(relationShipConfigSpecial1["non"]==1) WfForm.changeFieldValue("field" + fieldConfig.fieldId_yyzb + "_" + rowIndex, {value:""});
	          }
	        }
	      }
	    }
	    //20220411001-END
	    //20220411002-START-提交校验KPI明细
	    {
	      let condition = "3_3,4";//类型_产品
	      let result = "1,5";//运营目标
	      let fieldConfig = {
	        detailIndex: 5,
	        fieldId_lx: 13740, //类型
	        fieldId_cp: 13810, //产品
	        fieldId_yymb: 15897, //运营目标
	      }
	      let tip = "KPI明细中至少有两行明细的运营目标字段分别包含Engagement和New Trader";
		  let tipEn = "There are at least two lines of operation target fields in KPI details, including engagement and new trader respectively.";
	      WfForm.registerCheckEvent(WfForm.OPER_SUBMIT + "," + WfForm.OPER_SUBMITCONFIRM + "," + WfForm.OPER_REMARK, function(callback){
	        let flag = false;
	        let cf = {};//confirm
	        let fieldValue_lx = WfForm.getFieldValue("field" + fieldConfig.fieldId_lx);
	        let fieldValue_cp = WfForm.getFieldValue("field" + fieldConfig.fieldId_cp);
	        let conditionPart = condition.split("_");
	        if(conditionPart[0].split(",").indexOf(fieldValue_lx)>-1&&conditionPart[1].split(",").indexOf(fieldValue_cp)>-1){
	          flag = true;
	          let rowArr = WfForm.getDetailAllRowIndexStr("detail_" + fieldConfig.detailIndex).split(",");
	          for(let i=0; i<rowArr.length; i++){
	            let rowIndex = rowArr[i];
	            if(rowIndex !== ""){
	              let fieldValue_yymb = WfForm.getFieldValue("field" + fieldConfig.fieldId_yymb + "_" + rowIndex);
	              if(result.split(",").indexOf(fieldValue_yymb)>-1){
	                cf[fieldValue_yymb] = true;
	              }
	            }
	          }
	        }
	        if(flag){
	          let flag2 = true;
	          let resultList = result.split(",");
	          for(let i=0;i<resultList.length;i++){
	            if(!cf[resultList[i]]) {
	              flag2 = false;
	              break;
	            }
	          }
	          if(flag2) callback();
	          else WfForm.showConfirm(languageid==7?tip:tipEn);
	        }else{
	          callback();
	        }
	      });
	    }
	    //20220411002-END
		//20220411003-START-预算类别选项控制
	    {
	      let fieldConfig = {
	        detailIndex: 5,
	        fieldId_lx: 13740, //类型
	        fieldId_yslb: 15898, //预算类别
	      }
	      let config = {
	        0: "0,1",
	        1: "2,3,4,5,6,7,8,9,12,13",
	        3: "10",
	        4: "11",
	        6: "14,15,16",
	      }
	      let initYslb = function(){
	        let fieldValue_lx = WfForm.getFieldValue("field" + fieldConfig.fieldId_lx);
	        let rowArr = WfForm.getDetailAllRowIndexStr("detail_" + fieldConfig.detailIndex).split(",");
	        let yslbSelection = config[fieldValue_lx];
	        for(let i=0; i<rowArr.length; i++){
	          let rowIndex = rowArr[i];
	          if(rowIndex !== ""){
	            let fieldValue_yslb = WfForm.getFieldValue("field" + fieldConfig.fieldId_yslb + "_" + rowIndex);
	            if(yslbSelection){
	              WfForm.controlSelectOption("field" + fieldConfig.fieldId_yslb + "_" + rowIndex, yslbSelection);
	              if(yslbSelection.split(",").indexOf(fieldValue_yslb)==-1) {
	                WfForm.changeFieldValue("field" + fieldConfig.fieldId_yslb + "_" + rowIndex, {value:""});
	              }
	            }else{
	              WfForm.controlSelectOption("field" + fieldConfig.fieldId_yslb + "_" + rowIndex, "");
	              WfForm.changeFieldValue("field" + fieldConfig.fieldId_yslb + "_" + rowIndex, {value:""});
	            }
	          }
	        }
	      }
	      WfForm.bindFieldChangeEvent("field" + fieldConfig.fieldId_lx, function(obj,id,value){
	        initYslb();
	      });
	      initYslb();
	      WfForm.registerAction(WfForm.ACTION_ADDROW + fieldConfig.detailIndex, function(rowIndex){
	        let fieldValue_lx = WfForm.getFieldValue("field" + fieldConfig.fieldId_lx);
	        let yslbSelection = config[fieldValue_lx];
	        let fieldValue_yslb = WfForm.getFieldValue("field" + fieldConfig.fieldId_yslb + "_" + rowIndex);
	        if(yslbSelection){
	          WfForm.controlSelectOption("field" + fieldConfig.fieldId_yslb + "_" + rowIndex, yslbSelection);
	          if(yslbSelection.split(",").indexOf(fieldValue_yslb)==-1) {
	            WfForm.changeFieldValue("field" + fieldConfig.fieldId_yslb + "_" + rowIndex, {value:""});
	          }
	        }else{
	          WfForm.controlSelectOption("field" + fieldConfig.fieldId_yslb + "_" + rowIndex, "");
	          WfForm.changeFieldValue("field" + fieldConfig.fieldId_yslb + "_" + rowIndex, {value:""});
	        }
	      });
	    }
	    //20220411003-END
	    //20220411004-START-类别切换判断是否清空KPI明细
	    {
	      let fieldConfig = {
	        detailIndex: 5,
	        fieldId_lx: 13740, //类型
	      }
	      let lastType = -1;
	      let config = [0, 1, 3, 4, 6];
	      WfForm.bindFieldChangeEvent("field" + fieldConfig.fieldId_lx, function(obj,id,value){
	        if(config.indexOf(parseInt(value))==-1){
	          WfForm.delDetailRow("detail_" + fieldConfig.detailIndex, "all");
	        }else{
	           if(lastType!=-1&&config.indexOf(lastType)==-1){
		WfForm.addDetailRow("detail_" + fieldConfig.detailIndex);
	             }
		}
		lastType = parseInt(value);
	      });
	    }
	    //20220411004-END
	    //20220419001-START-指定运营目标的必选运营指标的默认带出及提交校验
	    {
	      let fieldConfig = {
	        detailIndex: 5,
	        fieldId_yymb: 15897, //运营目标
	        fieldId_yyzb: 15899, //运营指标
	      }
	      let config = {
	        4: "9",
	        5: "16",
	        6: "21,22,23",
	        7: "16",
	      }
	      WfForm.bindDetailFieldChangeEvent("field" + fieldConfig.fieldId_yymb, function(id,rowIndex,value){
	        let zbv = config[value];
	        if(zbv){
	          WfForm.changeFieldValue("field" + fieldConfig.fieldId_yyzb + "_" + rowIndex, {value: zbv.split(",")[0]});
	        }
	      });
	      WfForm.registerCheckEvent(WfForm.OPER_SUBMIT + "," + WfForm.OPER_SUBMITCONFIRM + "," + WfForm.OPER_REMARK, function(callback){
	        let flag = true;
	        let dataSet = {};
	        let message = "若运营目标对应的运营指标选项中包含结尾带*号的选项, 且明细中包含该运营目标, 则明细中运营目标为该值的行中至少有一行的运营指标选项需要结尾带*号";
	        let messageEn = "If the <operation indicator> options corresponding to the operation target contain an asterisk (*) and the operation target is included in the details, at least one line of the operation indicator options corresponding to the operation target in the details must end with an asterisk (*). Such as there must contain trading vol as the operational indicators under New Trader or existing trader operation objectives.";
	        let rowArr = WfForm.getDetailAllRowIndexStr("detail_" + fieldConfig.detailIndex).split(",");
	        for(let i=0; i<rowArr.length; i++){
	          let rowIndex = rowArr[i];
	          if(rowIndex !== ""){
	            let fieldValue_yymb = WfForm.getFieldValue("field" + fieldConfig.fieldId_yymb + "_" + rowIndex);
	            let fieldValue_yyzb = WfForm.getFieldValue("field" + fieldConfig.fieldId_yyzb + "_" + rowIndex);
	            if(!dataSet[fieldValue_yymb]){
	              dataSet[fieldValue_yymb] = [];
	            }
	            dataSet[fieldValue_yymb].push(fieldValue_yyzb);
	          }
	        }
	        for(let key in dataSet){
	          if(config[key]){
	            let innerFlag = false;
	            let mustValueList = config[key].split(",");
	            for(let k=0;k<mustValueList.length;k++){
	              if(dataSet[key].indexOf(mustValueList[k])>-1){
	                innerFlag = true;
	                break;
	              }
	            }
	            if(!innerFlag){
	              flag = false;
	            }
	          }
	        }
	        if(flag){
	          callback();
	        }else{
	          WfForm.showConfirm(languageid==7?message:messageEn);
	        }
	      });
	    }
	    //20220419001-END
	}
});