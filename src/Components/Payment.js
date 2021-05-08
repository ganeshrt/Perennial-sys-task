import { Grid, Paper, TextField, Button } from '@material-ui/core'
import React, { Component } from 'react'
import './payment.css'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import { findAllByTestId } from '@testing-library/dom';
const CARD_TYPES = [
    "Visa", "MasterCard", "Amex"
]
class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardType: "",
            cardNumber: 0,
            expiry: "",
            name: "",
            email: null,
            cards: [],
            pSuccess: false,
            invoices: "",
            error: {},
            hasError: true,
        }
    }

    async componentDidMount() {
        const res = await axios.get("http://www.mocky.io/v2/5d145fa22f0000ff3ec4f030");
        console.log(res.data.cardType)
        const { cards } = this.state;
        res.data.cardTypes.map(item => {
            if (CARD_TYPES.includes(item.value)) {
                cards.push(item.value);
            }
        })
        this.setState({
            cards,
        })
    }

    handleChange = (e) => {
        const { error } = this.state;
        error[e.target.name] = false;
        console.log(e.target.name)
        this.setState({
            [e.target.name]: e.target.value,
            error
        })
        if (error.name && error.expiry && error.cardNumber && error.cardType) {
            this.setState({
                hasError: false,
            })
        }
        console.log(this.state);
    }
    handleCardNumber = (e) => {
        const { error, cardType } = this.state;
        error.cardNumber = false;
        if ((cardType === "Amex" && e.target.value.length <= 15) || e.target.value.length <= 16) {
            console.log(e.target.value.length)
            this.setState({
                [e.target.name]: e.target.value,
                error
            })
        }
        if (error.name && error.expiry && error.cardNumber && error.cardType) {
            this.setState({
                hasError: false,
            })
        }
        console.log(this.state);
    }
    handleEmail = (e) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const isValid = emailPattern.test(e.target.value);
        const { error } = this.state;
        console.log("valid", isValid)
        error.email = false;
        this.setState({
            email: e.target.value,
            error
        })
        if (!isValid) {
            error.email = true;
            this.setState({
                error,
            })
        }
    }
    handleExpiry = (e) => {
        // const emailPattern = /^[0-9]+\/[0-9]$/;
        // const isValid = emailPattern.test(e.target.value);
        const { error } = this.state;
        // console.log("valid", isValid)
        error.expiry = false;
        this.setState({
            expiry: e.target.value,
            error
        })

    }
    onSubmit = async (e) => {
        const res = await axios.get("http://www.mocky.io/v2/5d8de422310000b19d2b517a");
        console.log(res)
        if (res.data.responseMessage) {
            this.setState({
                pSuccess: true,
                invoices: res.data.invoiceNo
            })
        }
    }

    onBlurHandle = (e) => {
        // const { error } = this.state;
        // error[e.target.name] = true;
        // // if(this)
        // this.setState({
        //     error,
        // })

        // console.log(this.state);
    }
    render() {
        const {
            cardType, cardNumber, expiry, name, email, cards, pSuccess, error, hasError,
        } = this.state;
        return (
            <div>
                <Grid container spacing={3} className="root">
                    <Grid item sm={5}>
                        <Paper className="paper">
                            <InputLabel >Product : ABCD</InputLabel>
                            <InputLabel >Product : 8 may 2021</InputLabel>
                            <InputLabel >Amount : 1233.03 USD</InputLabel>
                            <div className="div1">
                                {
                                    pSuccess && <div style={{ margin: "10px", color: "green" }}>
                                        <InputLabel style={{ color: "green" }} >Payment has been Successfully Processed</InputLabel>
                                        <InputLabel >Invoice: {this.state.invoices}</InputLabel>
                                    </div>
                                }
                            </div>

                        </Paper>
                    </Grid>
                    <Grid item sm={7}>
                        <Paper className="paper">
                            <FormControl className="formControl">
                                <InputLabel id="demo-simple-select-label">Card Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    className="sel"
                                    name="cardType"
                                    value={cardType}
                                    onChange={this.handleChange}
                                >
                                    {
                                        cards.map((item, i) => <MenuItem value={item} key={`${item}${i}`}>{item}</MenuItem>
                                        )
                                    }
                                </Select>

                                <TextField required
                                    error={error.cardNumber}
                                    className="ele"
                                    id="standard-required"
                                    type="number"
                                    name="cardNumber"
                                    maxLength={16}
                                    label="Card Number"
                                    onBlur={this.onBlurHandle}
                                    onChange={this.handleCardNumber}
                                />

                                <TextField required id="standard-required" label="Expiry"
                                    error={error.expiry}
                                    className="ele"
                                    onChange={this.handleExpiry}
                                    onBlur={this.onBlurHandle}
                                    name="expiry" />

                                <TextField required id="standard-required"
                                    name="name"
                                    error={error.name}
                                    onChange={this.handleChange}
                                    onBlur={this.onBlurHandle}
                                    className="ele" label="Name" />

                                <TextField id="standard-required"
                                    name="email"
                                    error={error.email}
                                    className="ele"
                                    onChange={this.handleEmail}
                                    // onBlur={this.onBlurHandle}
                                    label="Email" />

                                <Button variant="contained"
                                    disabled={cardType === "" || cardNumber <= 0 || expiry === "" || name === ""}
                                    onClick={this.onSubmit}
                                    className="ele" color="primary">
                                    Confirm Payment
                                </Button>
                            </FormControl>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Payment