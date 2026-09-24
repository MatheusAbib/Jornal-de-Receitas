import './Input.css';

function Input({ id, label, type = 'text', icon, value, onChange, required, disabled, autoComplete, maxLength, children, mostrarSenha, onToggleSenha, ...rest }) {
  const tipoFinal = onToggleSenha ? (mostrarSenha ? 'text' : 'password') : type;

  return (
    <div className="input-with-icon">
      {children ? (
        <select
          id={id}
          className="form-control-edit"
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          {...rest}
        >
          {children}
        </select>
      ) : (
        <input
          id={id}
          type={tipoFinal}
          className="form-control-edit"
          placeholder=" "
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
          {...rest}
        />
      )}
      <label htmlFor={id}>{label}</label>
      {icon && <i className={icon}></i>}
      {onToggleSenha && (
        <span
          className={`input-toggle-senha pi ${mostrarSenha ? 'pi-eye-slash' : 'pi-eye'}`}
          onClick={onToggleSenha}
          role="button"
          aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
        ></span>
      )}
    </div>
  );
}

export default Input;
