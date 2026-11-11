import { useId } from 'react';
import './Input.css';

function Input({
  id,
  label,
  type = 'text',
  icon,
  value,
  onChange,
  required,
  disabled,
  autoComplete,
  maxLength,
  children,
  mostrarSenha,
  onToggleSenha,
  ...rest
}) {
  const idGerado = useId();
  const inputId = id || idGerado;

  const tipoFinal = onToggleSenha
    ? mostrarSenha
      ? 'text'
      : 'password'
    : type;

  const possuiValor =
    value !== undefined &&
    value !== null &&
    String(value).length > 0;

  const possuiSelecao = Boolean(children);

  return (
    <div
      className={[
        'input-with-icon',
        possuiValor ? 'input-has-value' : '',
        possuiSelecao ? 'input-is-select' : '',
        icon ? 'input-has-icon' : '',
        onToggleSenha ? 'input-has-toggle' : '',
        disabled ? 'input-is-disabled' : ''
      ].filter(Boolean).join(' ')}
    >
      {possuiSelecao ? (
        <select
          id={inputId}
          className="form-control-edit"
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          {...rest}
        >
          {children}
        </select>
      ) : (
        <input
          id={inputId}
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

      <label htmlFor={inputId}>
        {label}
        {required && (
          <span className="input-required" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {icon && (
        <i
          className={`input-field-icon ${icon}`}
          aria-hidden="true"
        ></i>
      )}

      {possuiSelecao && (
        <i
          className="pi pi-chevron-down input-select-arrow"
          aria-hidden="true"
        ></i>
      )}

      {onToggleSenha && (
        <button
          type="button"
          className="input-toggle-senha"
          onClick={onToggleSenha}
          disabled={disabled}
          aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={Boolean(mostrarSenha)}
          aria-controls={inputId}
        >
          <i
            className={`pi ${mostrarSenha ? 'pi-eye-slash' : 'pi-eye'}`}
            aria-hidden="true"
          ></i>
        </button>
      )}
    </div>
  );
}

export default Input;