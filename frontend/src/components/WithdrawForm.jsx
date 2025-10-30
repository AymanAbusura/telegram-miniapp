import texts from "../data/texts.json";

export default function WithdrawForm({
  withdrawAmount,
  setWithdrawAmount,
  handleWithdrawSubmit,
  errorMessage,
}) {
  const content = texts.withdrawForm;

  return (
    <>
      <h2>{content.title}</h2>

      <input
        type="number"
        placeholder={content.inputPlaceholder}
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)}
        className="amount-input"
      />

      {errorMessage && (
        <div
          style={{
            color: content.errorColor,
            fontWeight: content.errorWeight,
          }}
        >
          {errorMessage}
        </div>
      )}

      <button onClick={handleWithdrawSubmit} className="amount-submit-button">
        {content.buttonText}
      </button>
    </>
  );
}