import React from "react"
import ReactDOM from "react-dom"
import { useEffect, useState, useRef } from "react"
import * as moment from "moment"

import "./index.css"
const products = require("../build/public/products.json")

const App = () => {
    const inputRef = useRef(null)
    const monthRef = useRef(null)

    const [months, setMonths] = useState(0)
    const [loanType, setLoanType] = useState<Object | any>({})
    const [loanAmount, setLoanAmount] = useState<string>("")
    const [monthlyAmount, setMonthlyAmount] = useState("")
    const [total, setTotal] = useState<number>(0.0)
    const [totalFormatted, setTotalFormatted] = useState("")
    const [targetMonth, setTargetMonth] = useState("")
    const [targetYear, setTargetYear] = useState("")

    function handleRightClick() {
        months < Number(loanType.product?.max_tenure) && setMonths(months + 1)
    }
    function handleLeftClick() {
        months > Number(loanType.product?.min_tenure) && setMonths(months - 1)
    }
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setMonths(
            Math.min(
                Math.max(Number(loanType.product?.min_tenure), Number(e.target.value)),
                Number(loanType.product?.max_tenure)
            )
        )
    }

    var formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    })

    function formatAmount(inputRef: { target: any }) {
        //remove "," and "." from input value and convert to number
        const amount = parseInt(inputRef.target.value.replace(/,/g, "").replace(/\./g, ""))

        console.log(amount)
        setLoanAmount(inputRef.target.value)

        let x = formatter.format(amount).substring(1)
        inputRef.target.value = x
    }

    useEffect(() => {
        if (loanType.product) {
            // setting month input for minimun per default

            setMonths(Number(loanType.product.min_tenure))
            //setting the default loan amount for the minimum

            let x = formatter.format(loanType.product.min_amount).substring(1)
            setLoanAmount(x)
        }
    }, [loanType])

    useEffect(() => {
        let amount = parseInt(loanAmount.replace(/,/g, "").replace(/\./g, ""))
        if (amount > 0) {

            //calculating total amount
            let x = amount +( amount * Number(loanType.product?.interest))
            setTotal(x)

            //formating the total to have it as a money display
            setTotalFormatted(Number(x).toLocaleString("en-US"))

            //calculating monthly installment
            setMonthlyAmount(new Intl.NumberFormat().format(x / months))

            //setting the target month with momentjs
            setTargetMonth(moment.default().add(months, "months").format("MMMM"))

            //setting the target year with momentjs
            setTargetYear(moment.default().add(months, "months").format("YYYY"))
        }
    }, [loanAmount, months])

    return (
        <>
            <div className="title">
                Let's plan your <b>loan</b>.
            </div>
            <div className="box">
                <div className="flex">
                    {products.map(
                        (product: { image: string | undefined; name: string }, key: any) => (
                            <div key={key}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    width={
                                        product.name === "Cash Loan"
                                            ? "69"
                                            : product.name === "Automobile Loan"
                                            ? "86"
                                            : product.name === "Housing Loan"
                                            ? "74"
                                            : "74"
                                    }
                                    height={
                                        product.name === "Cash Loan"
                                            ? "69"
                                            : product.name === "Automobile Loan"
                                            ? "86"
                                            : product.name === "Housing Loan"
                                            ? "74"
                                            : "69"
                                    }
                                    className="image"
                                    onClick={() => setLoanType({ product })}></img>
                            </div>
                        )
                    )}
                </div>
                <div className="innerBox">
                    <div className="flex">
                        <div className="loan">
                            <p>Loan amount</p>
                            <input
                                type="text"
                                className="amount"
                                ref={inputRef}
                                defaultValue={loanAmount || ""}
                                onChange={formatAmount}></input>

                            <img src="/assets/dollar.png" alt="dollar" className="dollar"></img>
                        </div>
                        <div className="loan">
                            <p>Number of Months</p>
                            <input
                                onChange={handleChange}
                                ref={monthRef}
                                type="number"
                                className="months"
                                value={months}
                                min={loanType ? loanType.product?.min_tenure : "1"}
                                max={loanType ? loanType.product?.max_tenure : "12"}></input>
                            <img
                                src="/assets/right.png"
                                alt="dollar"
                                className="right"
                                onClick={handleRightClick}></img>
                            <img
                                src="/assets/left.png"
                                alt="dollar"
                                className="left"
                                onClick={handleLeftClick}></img>
                        </div>
                    </div>
                    <div className="box2">
                        <div className="top">
                            <div className="subtitle">Monthly amount</div>
                            <div className="money">${monthlyAmount}</div>
                        </div>
                        <div className="bottom">
                            <div className="information">
                                You’re planning {months} <b>monthly deposits</b> to reach your{" "}
                                <b>${loanAmount}</b> goal by{" "}
                                <b>
                                    {targetMonth} {targetYear}
                                </b>
                                . The total amount loaned will be{" "}
                                <b>${totalFormatted ? totalFormatted : "0"}</b>
                            </div>
                        </div>
                    </div>
                    <button>Apply Now</button>
                </div>
            </div>
        </>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))
