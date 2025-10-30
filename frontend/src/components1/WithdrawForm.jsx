export default function WithdrawForm({
    withdrawAmount,
    setWithdrawAmount,
    handleWithdrawSubmit,
    errorMessage
}) {
    return (
        <>
            <h2>Withdrawal</h2>

            <input
                type="number"
                placeholder="Amount ($)"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="amount-input"
            />

            {errorMessage && (
                <div style={{ color: "red", fontWeight: "bold" }}>
                    {errorMessage}
                </div>
            )}

            <button onClick={handleWithdrawSubmit} className="amount-submit-button">
                Ready
            </button>
        </>
    );
}