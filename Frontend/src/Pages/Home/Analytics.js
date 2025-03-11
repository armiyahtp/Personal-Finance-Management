import React, { useMemo, Fragment } from "react";
import { Container, Row } from "react-bootstrap";
import CircularProgressBar from "../../components/CircularProgressBar";
import LineProgressBar from "../../components/LineProgressBar";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Analytics = ({ transactions }) => {
  const { totalIncome, totalExpense, categoryData, totalTurnover } = useMemo(() => {
    const totalIncome = transactions
      .filter((item) => item.transactionType === "credit")
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions
      .filter((item) => item.transactionType === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    const totalTurnover = totalIncome + totalExpense;

    const categoryData = transactions.reduce((acc, t) => {
      acc[t.category] = acc[t.category] || { income: 0, expense: 0 };
      t.transactionType === "credit" ? (acc[t.category].income += t.amount) : (acc[t.category].expense += t.amount);
      return acc;
    }, {
      Groceries: { income: 0, expense: 0 },
      Rent: { income: 0, expense: 0 },
      Salary: { income: 0, expense: 0 },
      Tip: { income: 0, expense: 0 },
      Food: { income: 0, expense: 0 },
      Medical: { income: 0, expense: 0 },
      Utilities: { income: 0, expense: 0 },
      Entertainment: { income: 0, expense: 0 },
      Transportation: { income: 0, expense: 0 },
      Other: { income: 0, expense: 0 },
    });

    return { totalIncome, totalExpense, categoryData, totalTurnover };
  }, [transactions]);

  return (
    <Container className="mt-5">
      <Row>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 shadow-lg">
            <div className="card-header bg-success text-white">
              <span style={{ fontWeight: "bold" }}>Total Transactions:</span> {transactions.length}
            </div>
            <div className="card-body">
              <h5 className="card-title" style={{ color: "green" }}>
                Income: <ArrowDropUpIcon />{totalIncome.toFixed(2)}
              </h5>
              <h5 className="card-title" style={{ color: "red" }}>
                Expense: <ArrowDropDownIcon />{totalExpense.toFixed(2)}
              </h5>
              <div className="d-flex justify-content-center mt-3">
                <CircularProgressBar
                  percentage={totalTurnover ? ((totalIncome / totalTurnover) * 100).toFixed(0) : 0}
                  color="green"
                />
              </div>
              <div className="d-flex justify-content-center mt-4 mb-2">
                <CircularProgressBar
                  percentage={totalTurnover ? ((totalExpense / totalTurnover) * 100).toFixed(0) : 0}
                  color="red"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 shadow-lg">
            <div className="card-header bg-success text-white">
              <span style={{ fontWeight: "bold" }}>Total Turnover:</span> {totalTurnover.toFixed(2)}
            </div>
            <div className="card-body">
              <h5 className="card-title" style={{ color: "green" }}>
                Income: <ArrowDropUpIcon /> {totalIncome.toFixed(2)} <CurrencyRupeeIcon />
              </h5>
              <h5 className="card-title" style={{ color: "red" }}>
                Expense: <ArrowDropDownIcon /> {totalExpense.toFixed(2)} <CurrencyRupeeIcon />
              </h5>
              <div className="d-flex justify-content-center mt-3">
                <CircularProgressBar
                  percentage={totalTurnover ? ((totalIncome / totalTurnover) * 100).toFixed(0) : 0}
                  color="green"
                />
              </div>
              <div className="d-flex justify-content-center mt-4 mb-4">
                <CircularProgressBar
                  percentage={totalTurnover ? ((totalExpense / totalTurnover) * 100).toFixed(0) : 0}
                  color="red"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 shadow-lg">
            <div className="card-header bg-success text-white">
              <span style={{ fontWeight: "bold" }}>Categorywise Income</span>
            </div>
            <div className="card-body">
              {Object.entries(categoryData).map(([category, data]) => (
                <Fragment key={category}>
                  {data.income > 0 && (
                    <LineProgressBar
                      label={category}
                      percentage={totalTurnover ? ((data.income / totalTurnover) * 100).toFixed(0) : 0}
                      lineColor="#36A2EB"
                    />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 shadow-lg">
            <div className="card-header bg-success text-white">
              <span style={{ fontWeight: "bold" }}>Categorywise Expense</span>
            </div>
            <div className="card-body">
              {Object.entries(categoryData).map(([category, data]) => (
                <Fragment key={category}>
                  {data.expense > 0 && (
                    <LineProgressBar
                      label={category}
                      percentage={totalTurnover ? ((data.expense / totalTurnover) * 100).toFixed(0) : 0}
                      lineColor="#FF6384"
                    />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </Row>
    </Container>
  );
};

export default Analytics;