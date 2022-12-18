import { Issue } from "./Issue.js"




//global references
var btn_store_issue = document.getElementById("issue_submit")
btn_store_issue.addEventListener("click", store_issue)

var issue_dashboard_display_box = document.getElementById("issue_dashboard_display_box")

var body = document.getElementsByTagName("body")[0]
body.addEventListener("onload", updateDashboard())

var share_to_cloud_button = document.getElementById("share_to_cloud")
share_to_cloud_button.addEventListener("click", handleShareToCloud)

var input_tag = document.getElementById("input_part_number")


async function autoCompleteHandler(){

    let secret = prompt("Enter App Secret ",null)

    const partsListURL = "https://ap-south-1.aws.data.mongodb-api.com/app/inspectiondatalogger-akpda/endpoint/fetchParts?secret="+secret
    
    const data = await axios.get(partsListURL)
    console.log(data.status)
    const list = data.data.data
    console.log(list.length)
    let list_of_elems = ""
    list.forEach(item=>{
        let option_element = document.createElement("option")
        option_element.setAttribute("value",item)
        list_of_elems+=`<option value="${item}"/>`
    })

    $( "#input_part_number" ).autocomplete({
        source: [...list],
        minLength : 3,
        delay : 500
      });
}


autoCompleteHandler()


function handleShareToCloud() {
    const mailHandler = "https://ap-south-1.aws.data.mongodb-api.com/app/inspectiondatalogger-akpda/endpoint/sendMail"
    var secret = prompt("Enter the Secret Value", null)
    //SEND DATA TO CLOUD ONLY IF DATA EXISTS IN LOCAL STORAGE
    if (Object.keys(localStorage).length > 0) {
        if (secret.length < 0) {
            console.log("Value is required")
        }
        else {
            axios.get(mailHandler, { params: { secret: secret , data : buildEmailString() } }).then((data) => {
                if(data.status===200){
                    localStorage.clear()
                    updateDashboard()
                }
            })
        }
    }
    else{
        alert("No Data !")
    }
}

function buildEmailString(){
        //get all the items from localStorage
        var localStorageKeys = Object.keys(localStorage)
        let total_number_of_issues = localStorageKeys.length
        let total_measured_qty = 0
        let total_critical_issues = 0
        let total_non_critical_issues = 0
    
        let list_of_issues_string = ''
    
        localStorageKeys.forEach(key => {
            let issue = JSON.parse(localStorage.getItem(key))
            total_measured_qty += issue.issue_measured_qty
            total_critical_issues += issue.number_of_critical_issue
            total_non_critical_issues += issue.number_of_non_critical_issue
    
            //build the string
            let issue_date = issue.issue_date
            let issue_part_number = issue.issue_part_number
            let issue_measured_qty = issue.issue_measured_qty
            let issue_measured_at_stage = issue.issue_measured_at_stage
            let number_of_critical_issue = issue.number_of_critical_issue
            let number_of_non_critical_issue = issue.number_of_non_critical_issue
            let critical_issue_remark = issue.critical_issue_remark
            let non_critical_issue_remark = issue.non_critical_issue_remark
    
            let issue_string = 
            `${issue_date}<br>
            ${issue_part_number}<br>
            ${issue_measured_at_stage}<br>
            Total Measured :${issue_measured_qty}<br>
            Total Critical Qty : ${number_of_critical_issue}<br>
            Total Non Critical Qty : ${number_of_non_critical_issue}<br>
            Remarks for Critical Issue : ${critical_issue_remark}<br>
            Remarks for Non Critical Issue : ${non_critical_issue_remark}<br>
            ------------------------------------------------<br>`
    
            list_of_issues_string+=issue_string
            
    
        })

        let summary = `Summary <br>Total Issues Logged : ${total_number_of_issues}<br>Total Measured Qty : ${total_measured_qty}<br>Total Critical Issues : ${total_critical_issues}<br>Total Non Critical Issues : ${total_non_critical_issues}<br><br>`


    
        return summary + '<br>' +list_of_issues_string
    
}


function updateDashboard() {

    //get all the items from localStorage
    var localStorageKeys = Object.keys(localStorage)
    let total_number_of_issues = localStorageKeys.length
    let total_measured_qty = 0
    let total_critical_issues = 0
    let total_non_critical_issues = 0

    let list_of_issues_string = ''

    localStorageKeys.forEach(key => {
        let issue = JSON.parse(localStorage.getItem(key))
        total_measured_qty += issue.issue_measured_qty
        total_critical_issues += issue.number_of_critical_issue
        total_non_critical_issues += issue.number_of_non_critical_issue

        //build the string
        let issue_date = issue.issue_date
        let issue_part_number = issue.issue_part_number
        let issue_measured_qty = issue.issue_measured_qty
        let issue_measured_at_stage = issue.issue_measured_at_stage
        let number_of_critical_issue = issue.number_of_critical_issue
        let number_of_non_critical_issue = issue.number_of_non_critical_issue
        let critical_issue_remark = issue.critical_issue_remark
        let non_critical_issue_remark = issue.non_critical_issue_remark

        let issue_string = `-------------------------------------\n
        ${issue_date}\n
        ${issue_part_number}\n
        ${issue_measured_at_stage}\n
        Total Measured :${issue_measured_qty}\n
        Total Critical Qty : ${number_of_critical_issue}\n
        Total Non Critical Qty : ${number_of_non_critical_issue}\n
        Remarks for Critical Issue : ${critical_issue_remark}\n
        Remarks for Non Critical Issue : ${non_critical_issue_remark}\n
        ------------------------------------------------\n`

        list_of_issues_string+=issue_string
        

    })

    issue_dashboard_display_box.innerHTML = `Total Issues Logged : ${total_number_of_issues} | Total Measured Qty : ${total_measured_qty} <br> Total Critical Issues : ${total_critical_issues} | Total Non Critical Issues : ${total_non_critical_issues}`
}

function store_issue(event) {

    event.preventDefault()

    //get the message box handle
    let control_box_message = document.getElementById("control_box_message")

    //get all the values
    let input_part_number = document.getElementById("input_part_number").value
    let input_issue_stage = document.getElementById("input_issue_stage").value
    let input_measured_qty = parseInt(document.getElementById("input_measure_qty").value)
    let input_critical_qty = parseInt(document.getElementById("input_critical_qty").value)
    let input_non_critical_qty = parseInt(document.getElementById("input_non_critical_qty").value)
    let input_reason_for_critical_issue = document.getElementById("input_reason_for_critical_issue").value
    let input_reason_for_non_critical_issue = document.getElementById("input_reason_for_non_critical_issue").value

    if (input_part_number.length > 0) {
        //part number value is not empty
        if (input_measured_qty > 0) {
            //we must check if sum of critical issues and non critical issues should be less
            //then the measured qty
            let total_issue_qty = input_critical_qty + input_non_critical_qty
            if (total_issue_qty <= input_measured_qty) {
                var issue = new Issue(new Date().toLocaleString(), input_part_number, input_measured_qty, input_issue_stage, input_critical_qty, input_non_critical_qty, input_reason_for_critical_issue, input_reason_for_non_critical_issue)
                let issue_item = JSON.stringify(issue.getIssue())
                let issue_id = new Date().getTime()
                localStorage.setItem(issue_id, issue_item)
                control_box_message.textContent = "Saved Successfully..."
                updateDashboard()
            }
            else {
                control_box_message.textContent = "Measured Qty cannot be less then Critical & Non Critical Qty"
            }
        }

        else {
            control_box_message.textContent = "Measured Qty is 0"
        }
    }
    else {
        control_box_message.textContent = "Part Field is Empty"
    }
}


