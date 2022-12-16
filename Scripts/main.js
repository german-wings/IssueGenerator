import {Issue} from "./Issue.js"


var btn_store_issue = document.getElementById("issue_submit")
btn_store_issue.addEventListener("click" , store_issue)


function store_issue(event){

    event.preventDefault()

    //get all the values
    let input_part_number = document.getElementById("input_part_number").value
    let input_issue_stage = document.getElementById("input_issue_stage").value
    let input_measured_qty = document.getElementById("input_measure_qty").value
    let input_critical_qty = document.getElementById("input_critical_qty").value
    let input_non_critical_qty = document.getElementById("input_non_critical_qty").value
    let input_reason_for_critical_issue = document.getElementById("input_reason_for_critical_issue").value
    let input_reason_for_non_critical_issue = document.getElementById("input_reason_for_non_critical_issue").value

    var issue = new Issue(new Date().toLocaleString() , input_part_number , input_measured_qty , input_issue_stage , input_critical_qty , input_non_critical_qty , input_reason_for_critical_issue , input_reason_for_non_critical_issue)

    console.log(issue.getIssue())

}


