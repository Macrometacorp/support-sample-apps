## Sample

@App:name("BankTransactionsApp")
@App:qlVersion("2")

CREATE STREAM CashWithdrawalStream(branchID string, amount long);

CREATE STREAM CashDepositsStream(branchID string, amount long);

CREATE SINK CashFlowStream WITH (type='stream', stream='CashFlowStream') (branchID string, withdrawalAmount long, depositAmount long);

insert into CashFlowStream
select w.branchID as branchID, w.amount as withdrawalAmount, d.amount as depositAmount
from CashWithdrawalStream as w join CashDepositsStream as d 
    on w.branchID == d.branchID
having w.amount > d.amount * 0.95;
