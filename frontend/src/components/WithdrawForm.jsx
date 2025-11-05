export default function WithdrawForm({
  withdrawAmount,
  setWithdrawAmount,
  handleWithdrawSubmit,
  errorMessage,
  content
}) {

  const {
    title,
    inputPlaceholder,
    buttonText,
    errorColor,
    errorWeight,
  } = content;

  return (
    <>
      <h2>{title}</h2>

      <input
        type="number"
        placeholder={inputPlaceholder}
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)}
        className="amount-input"
      />

      {errorMessage && (
        <div
          style={{
            color: errorColor,
            fontWeight: errorWeight,
          }}
        >
          {errorMessage}
        </div>
      )}

      <button onClick={handleWithdrawSubmit} className="amount-submit-button">
        {buttonText}
      </button>
    </>
  );
}