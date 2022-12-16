export class Issue {
    constructor(issue_date, issue_part_number, issue_measured_qty, issue_measured_at_stage, number_of_critical_issue, number_of_non_critical_issue, critical_issue_remark, non_critical_issue_remark) {
        this.issue_date = issue_date
        this.issue_part_number = issue_part_number
        this.issue_measured_qty = issue_measured_qty
        this.issue_measured_at_stage = issue_measured_at_stage
        this.number_of_critical_issue = number_of_critical_issue
        this.number_of_non_critical_issue = number_of_non_critical_issue
        this.critical_issue_remark = critical_issue_remark
        this.non_critical_issue_remark = non_critical_issue_remark
    }

    getIssue() {
        let issue = {
            issue_date: this.issue_date,
            issue_part_number: this.issue_part_number,
            issue_measured_qty: this.issue_measured_qty,
            issue_measured_at_stage: this.issue_measured_at_stage,
            number_of_critical_issue: this.number_of_critical_issue,
            number_of_non_critical_issue: this.number_of_non_critical_issue,
            critical_issue_remark: this.critical_issue_remark,
            non_critical_issue_remark: this.non_critical_issue_remark
        }

        return issue
    }
}