import React, { useState, useEffect } from "react";
import "./home.css";
import Header from "../../components/Header";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import Analytics from "./Analytics";
import { Button, Modal, Form, Container } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useNavigate } from "react-router-dom";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const Home = () => {
  const navigate = useNavigate();
  const [cUser, setcUser] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("all");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) navigate("/login");
    else setcUser(storedUser);
  }, [navigate]);

  useEffect(() => {
    if (!cUser) return;
    const fetchAllTransactions = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(getTransactions, {
          type,
          frequency,
          startDate: startDate ? startDate.toISOString() : null,
          endDate: endDate ? endDate.toISOString() : null,
        });
        if (data.success) setTransactions(data.transactions);
        else toast.error("Failed to fetch transactions");
      } catch (err) {
        toast.error(err.response?.data?.message || "Error fetching transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchAllTransactions();
  }, [cUser, refresh, frequency, type, startDate, endDate]);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleChangeFrequency = (e) => {
    setFrequency(e.target.value);
  };

  const handleSetType = (e) => {
    setType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, amount, description, category, date, transactionType } = values;

    if (!title || !amount || !description || !category || !date || !transactionType) {
      toast.error("Please enter all fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(addTransaction, { ...values, userId: cUser._id });
      if (data.success) {
        toast.success(data.message);
        setValues({ title: "", amount: "", description: "", category: "", date: "", transactionType: "" });
        handleClose();
        setRefresh(!refresh);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("all");
  };

  const handleTableClick = () => setView("table");
  const handleChartClick = () => setView("chart");

  return (
    <>
      <Header />
      {loading ? (
        <Spinner />
      ) : (
        <Container style={{ position: "relative", zIndex: 2, backgroundColor: "transparent" }} className="mt-3">
          <div className="container-fluid">
            <div className="row align-items-center mb-4">
              <div className="col-md-4">
                <Form.Group className="mb-3" controlId="formSelectFrequency">
                  <Form.Label>Select Frequency</Form.Label>
                  <Form.Select name="frequency" value={frequency} onChange={handleChangeFrequency}>
                    <option value="all">Total</option>
                    <option value="7">Last Week</option>
                    <option value="30">Last Month</option>
                    <option value="365">Last Year</option>
                    <option value="custom">Custom</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3" controlId="formSelectType">
                  <Form.Label>Type</Form.Label>
                  <Form.Select name="type" value={type} onChange={handleSetType}>
                    <option value="all">All</option>
                    <option value="expense">Expense</option>
                    <option value="credit">Income</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-4 d-flex justify-content-end align-items-end">
                <Button variant="success" onClick={handleReset}>Reset Filter</Button>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-md-11 d-flex justify-content-between align-items-center">
                <div>
                  <Button onClick={handleShow} variant="success" className="addNew me-2 mb-5">Add New</Button>
                  <Button onClick={handleShow} variant="success" className="mobileBtn mb-3">+</Button>
                </div>
              </div>
              <div className="tb item-center text-white ms-3">
                <FormatListBulletedIcon
                  sx={{ cursor: "pointer" }}
                  onClick={handleTableClick}
                  className={`${view === "table" ? "iconActive" : "iconDeactive"} mt-1 me-2 rounded-2`}
                />
                <BarChartIcon
                  sx={{ cursor: "pointer" }}
                  onClick={handleChartClick}
                  className={`${view === "chart" ? "iconActive" : "iconDeactive"} mt-1 rounded-2`}
                />
              </div>
            </div>
            <Modal show={show} onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>Add Transaction Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Title</Form.Label>
                        <Form.Control name="title" type="text" placeholder="Enter Transaction Name" value={values.title} onChange={handleChange} />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-3" controlId="formAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control name="amount" type="number" placeholder="Enter Amount" value={values.amount} onChange={handleChange} />
                      </Form.Group>
                    </div>
                  </div>
                  <Form.Group className="mb-3" controlId="formCategory">
                    <Form.Label>Category</Form.Label>
                    <Form.Select name="category" value={values.category} onChange={handleChange}>
                      <option value="">Choose...</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Rent">Rent</option>
                      <option value="Salary">Salary</option>
                      <option value="Tip">Tip</option>
                      <option value="Food">Food</option>
                      <option value="Medical">Medical</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" name="description" placeholder="Enter Description" value={values.description} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formTransactionType">
                    <Form.Label>Transaction Type</Form.Label>
                    <Form.Select name="transactionType" value={values.transactionType} onChange={handleChange}>
                      <option value="">Choose...</option>
                      <option value="credit">Credit</option>
                      <option value="expense">Expense</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="date" value={values.date} onChange={handleChange} />
                  </Form.Group>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" type="submit">Submit</Button>
                  </Modal.Footer>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
          {frequency === "custom" && (
            <div className="date">
              <div className="form-group">
                <label htmlFor="startDate" className="text-black">Start Date:</label>
                <div>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="endDate" className="text-black">End Date:</label>
                <div>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                  />
                </div>
              </div>
            </div>
          )}
          {view === "table" ? <TableData data={transactions} user={cUser} /> : <Analytics transactions={transactions} />}
          <ToastContainer />
        </Container>
      )}
    </>
  );
};

export default Home;