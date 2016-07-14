
/* JavaScript content from js/main.js in folder common */
/*
 * COPYRIGHT LICENSE: This information contains sample code provided in source code form. You may copy, modify, and distribute
 * these sample programs in any form without payment to IBM® for the purposes of developing, using, marketing or distributing
 * application programs conforming to the application programming interface for the operating platform for which the sample code is written.
 * Notwithstanding anything to the contrary, IBM PROVIDES THE SAMPLE SOURCE CODE ON AN "AS IS" BASIS AND IBM DISCLAIMS ALL WARRANTIES,
 * EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, SATISFACTORY QUALITY,
 * FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND ANY WARRANTY OR CONDITION OF NON-INFRINGEMENT. IBM SHALL NOT BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR OPERATION OF THE SAMPLE SOURCE CODE.
 * IBM HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS OR MODIFICATIONS TO THE SAMPLE SOURCE CODE.
 */
var pagesHistory = [];
var currentPage = {};
var path = "";
var regCity ="";
var regManufacturer="";

function wlCommonInit(){
	if (WL.Client.getEnvironment() == WL.Environment.ANDROID) {
	    path = "www/default/";
	}
	
	/*$("#pagePort").load(path + "pages/insureAssistLogin.html", function(){
		$.getScript(path + "js/main.js", function() {
			if (currentPage.init) {
				currentPage.init();
			}
			WL.Logger.info("inside main.js");
		});
	});*/
}

/*
 * 
 * onClick of GetQuote from login page
 * CityAndManufacturerAPI is invoked
 * 
 */

function submit(){
	
	pagesHistory.push(path + "pages/index.html");
	/*
	 * InsureAssistQuickQuote page is loaded and callCityAndManufacturerAPI is invoked
	 * 
	 */
	
	$("#pagePort").load(path + "pages/InsureAssistQuickQuote.html", function callCityAndManufacturerAPI(){
		try{
			
			WL.Logger.info("adapter is invoked");
	          var invocationData = {
	                  adapter : 'InsureAssistHTTPAdapter',
	                  procedure : 'getAllCitiesInsureAssistHTTPAdapter',
	                  parameters : []
	              };

	          WL.Client.invokeProcedure(invocationData,{
	              onSuccess : getCitiesCallSuccess,
	              onFailure : getCitiesCallFailure,
	          });
		
		}
		catch(e){
		}
	});
};

/*
 * onSuccess of Cities call
 */

function getCitiesCallSuccess(result){
	var responseText=result['responseText'];
	var responseText = responseText.replace("/*-secure-","");
	var responseText = responseText.replace("*/","");
	var responseText = JSON.parse(responseText);
	var array = responseText['array'];
	WL.Logger.info("success response for array"+array.length);
	var options="";
	 for(var i=0; i< array.length; i++){
		 var arrayPos = array[i];
		 options = $('<option/>').html(arrayPos.city_name);
         $("#rtoLocationSelector").append(options);
         WL.Logger.info("array[i]"+arrayPos.city_name);
     }
     
     //after successfull cities call manufacturer API will be invoked
     callManufactureAPI();
}

/*
 * on failure of cities call
 */
function getCitiesCallFailure(){
	alert("failure");
}

/*
 * call to manufacturer API
 */

function callManufactureAPI(){
	try{
		WL.Logger.info("callManufactureAPI adapter is invoked");
	          var invocationData = {
	                  adapter : 'InsureAssistHTTPAdapter',
	                  procedure : 'getAllManufacturersInsureAssistHTTPAdapter',
	                  parameters : []
	              };

	          WL.Client.invokeProcedure(invocationData,{
	              onSuccess : getManufacturersAPICallSuccess,
	              onFailure : getManufacturersAPICallFailure,
	          });
		}
		catch(e){
			console.log(e.message);
		}
}

/*
 * onSuccess of Manufacturer API call
 */

function getManufacturersAPICallSuccess(result){
	WL.Logger.info("response from manufacturer is "+result);
	var responseText=result['responseText'];
	var responseText = responseText.replace("/*-secure-","");
	var responseText = responseText.replace("*/","");
	var responseText = JSON.parse(responseText);
	var array = responseText['array'];
	WL.Logger.info("success response for array"+array.length);
	var options = "";
	 for(var i=0; i< array.length; i++){
		 var arrayPos = array[i];
		 options = $('<option/>').html(arrayPos.manufacturer_name);
		 $("#manufacturer").append(options);
         WL.Logger.info("array[i]"+arrayPos.manufacturer_name);
     }
	 
}
/*
 * onFailure of Manufacturer API call
 */
function getManufacturersAPICallFailure(){
	WL.Logger.info("response from manufacturer is failed ");
}
/*
 * call to models API
 */
function callModelsAPI(){
	try{
		var model=$('#manufacturer').val();
		
		WL.Logger.info("Models adapter is invoked"+model);
          var invocationData = {
                  adapter : 'InsureAssistHTTPAdapter',
                  procedure : 'getModelsInsureAssistHTTPAdapter',
                  parameters : [model]
              };

          WL.Client.invokeProcedure(invocationData,{
              onSuccess : getModelsCallSuccess,
              onFailure : getModelsCallFailure,
          });
	
	}
	catch(e){
		
	}
}
/*
 * onSuccess of models API call
 */
function getModelsCallSuccess(result){
	WL.Logger.info("response from model is "+result);
	var responseText=result['responseText'];
	var responseText = responseText.replace("/*-secure-","");
	var responseText = responseText.replace("*/","");
	var responseText = JSON.parse(responseText);
	var array = responseText['array'];
	WL.Logger.info("success response for array"+array.length);
	var options = "";
	$("#model").empty();
	for(var i=0; i< array.length; i++){
		 var arrayPos = array[i];
		 options = $('<option/>').html(arrayPos.model_name);
		 $("#model").append(options);
         WL.Logger.info(array[i]+arrayPos.model_name);
     }
	 
}
/*
 * onFailure of models API call 
 */
function getModelsCallFailure(){
	alert('failure');
}

/*
 * call to quickQuoteAPI
 */
function quickQuote(){
	
	var result = quickQuoteerrorcheck();
	if(result == true)
	{
	
	
	pagesHistory.push(path + "pages/InsureAssistQuickQuote.html");
	regCity = $('#rtoLocationSelector').val();
	regManufacturer = $('#manufacturer').val();
	$("#pagePort").load(path + "pages/InsureAssistQuoteResult.html");
	callAPI(regCity,regManufacturer);
	}
}
	
	function callAPI(regCity,regManufacturer){
		try{
		WL.Logger.info("adapter is invoked and regCity "+regCity+" : and : "+regManufacturer);
		var body = { city: regCity,
				maufacturer: regManufacturer
		};
	          var invocationData = {
	                  adapter : 'InsureAssistHTTPAdapter',
	                  procedure : 'getIDVAndPriceInsureAssistHTTPAdapters',
	                  parameters : [body]
	              };
	          WL.Client.invokeProcedure(invocationData,{
	              onSuccess : getAPICallSuccess,
	              onFailure : getAPICallFailure,
	          });
		}
		catch(e){
			console.log(e instanceof TypeError);
			console.log(e.message);
		}
	 
}

function getAPICallSuccess(result){
	var responseText=result['responseText'];
	var responseText = responseText.replace("/*-secure-","");
	var responseText = responseText.replace("*/","");
	WL.Logger.info("success"+responseText);
	var responseText = JSON.parse(responseText);
	var array = responseText['array'];
	var array = array[0];
	var price = array['price'];
	var idv = array['idv'];
	var label=document.getElementById("getYearlyPremiumWrapper");
	var label1=document.getElementById("rtoLocationdisplay");
	var label2=document.getElementById("manufacturerdisplay");
	label.innerHTML= "Yearly Premium: "+ price;
	label1.innerHTML= "RTO Location: Hyderabad";
	label2.innerHTML= "Manufacturer: Honda" ;
	WL.Logger.info("after label"+label.innerHTML);
}

function getAPICallFailure(){
	alert("failure");
}

// error check of quickquote page
function quickQuoteerrorcheck()
{
	alert(document.getElementById("rtoLocationSelector").value);
	if(document.getElementById("rtoLocationSelector").value == "Select RTO Location")
		{
		    document.getElementById("rtolocationerror").style.display="block";
		    document.getElementById("rtoLocationSelector").style.borderColor = "red !important";
		    return false;
		}
	else
		{
		document.getElementById("rtolocationerror").style.display="none";
	    document.getElementById("rtoLocationSelector").style.borderColor = "none";
		var regdate=document.getElementById("date").value;
		
		var dateerrorcheck = validatedate(regdate);
		
		
			if(dateerrorcheck == false || regdate == "")
			{
			    
			    document.getElementById("regdateerror").style.display="block";
			    document.getElementById("date").style.borderColor = "red !important";
			    return false;
			}
			else
			{
				document.getElementById("regdateerror").style.display="none";
			    document.getElementById("date").style.borderColor = "none";
			    if(document.getElementById("manufacturer").value == "Manufacturer")
				{
				    
				    document.getElementById("manufacturererror").style.display="block";
				    document.getElementById("manufacturer").style.borderColor = "red";
				    return false;
				}
			    else
			    {
			    	document.getElementById("manufacturererror").style.display="none";
				    document.getElementById("manufacturer").style.borderColor = "none";
				    if(document.getElementById("model").value == "Model")
				    {
				    	
					    document.getElementById("modelerror").style.display="block";
					    document.getElementById("model").style.borderColor = "red";
					    return false;
				    }
				    else
				    {
				    	
				    	document.getElementById("modelerror").style.display="none";
					    document.getElementById("model").style.borderColor = "none";
					    return true;
				    }
			    	
			    }
				
				}
		    
		}
}


function recalculatequote()
{
	pagesHistory.push(path + "pages/InsureAssistQuoteResult.html");
	$("#pagePort").load(path + "pages/InsureAssistQuickQuote.html", function callCityAndManufacturerAPI(){
		try{
			
			WL.Logger.info("adapter is invoked");
	          var invocationData = {
	                  adapter : 'InsureAssistHTTPAdapter',
	                  procedure : 'getAllCitiesInsureAssistHTTPAdapter',
	                  parameters : []
	              };

	          WL.Client.invokeProcedure(invocationData,{
	              onSuccess : getCitiesCallSuccess,
	              onFailure : getCitiesCallFailure,
	          });
		
		}
		catch(e){
		}
	});
}
function buyonline()
{
	pagesHistory.push(path + "pages/InsureAssistQuoteResult.html");
	$("#pagePort").load(path + "pages/InsureAssistInsuranceDetails.html");
	}
function newInsurance()
{
	pagesHistory.push(path + "pages/InsureAssistInsuranceDetails.html");
	$("#pagePort").load(path + "pages/InsureAssistExpandableList.html");
	}
function onBuyQuote(){
	
	pagesHistory.push(path + "pages/InsureAssistExpandableList.html");
	$("#pagePort").load(path + "pages/InsureAssistAdditionalDetails.html");
	
	}
	
function back()
{ 
	
	$("#pagePort").load(pagesHistory.pop());
	
	}



//datevalidation starts

function validatedate(inputText)  
{  
	
var dateformat = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;  
// Match the date format through regular expression 

alert(dateformat.test(inputText));
if(dateformat.test(inputText))  
{  

//Test which seperator is used '/' or '-'  
var opera1 = inputText.split('/');  
var opera2 = inputText.split('-');  
lopera1 = opera1.length;  
lopera2 = opera2.length;  
// Extract the string into month, date and year  
if (lopera1>1)  
{  
var pdate = inputText.split('/');  
}  
else if (lopera2>1)  
{  
var pdate = inputText.split('-');  
}  
var mm  = parseInt(pdate[0]);  
var dd = parseInt(pdate[1]);  
var yy = parseInt(pdate[2]);  
// Create list of days of a month [assume there is no leap year by default]  
var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];  
if (mm==1 || mm>2)  
{  
if (dd>ListofDays[mm-1])  
{  
alert('Invalid date format!');  
return false;  
}  
}  
if (mm==2)  
{  
var lyear = false;  
if ( (!(yy % 4) && yy % 100) || !(yy % 400))   
{  
lyear = true;  
}  
if ((lyear==false) && (dd>=29))  
{  
alert('Invalid date format!');  
return false;  
}  
if ((lyear==true) && (dd>29))  
{  
alert('Invalid date format!');  
return false;  
}  
}  
}  
else  
{  
alert("Invalid date format!");  
   
return false;  
}  
}  

//datevalidation ends

/* JavaScript content from js/main.js in folder android */
// This method is invoked after loading the main HTML and successful initialization of the IBM MobileFirst Platform runtime.
function wlEnvInit(){
    wlCommonInit();
    // Environment initialization code goes here
}