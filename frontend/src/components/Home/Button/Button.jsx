import './Button.css';

function Button({ children, variant = 'primary', type = 'button', onClick, disabled, loading, className = '', ...rest }) {
  const estaDesabilitado = disabled || loading;

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${loading ? 'btn-loading' : ''} ${className}`}
      onClick={onClick}
      disabled={estaDesabilitado}
      {...rest}
    >
      {loading ? (
        <>
          <i className="pi pi-spin pi-spinner"></i>
          <span>Carregando...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
