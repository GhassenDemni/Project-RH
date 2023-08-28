'use client';
import * as React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  text?: string;
  label?: string;
  title?: string;
  error?: string;
  errors?: any;
  helper?: any;
  mode?: 'icon' | 'checkbox';
}

const InputPro = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, title, type, text, error, errors, helper, mode, name, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputComponent = (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <Input
            id={name}
            name={name}
            type={type === 'password' && showPassword === true ? 'text' : type}
            className={className}
            ref={ref}
            {...props}
          />
          {type === 'password' && (
            <div
              style={{
                userSelect: 'none',
              }}
              className="relative flex gap-2 text-sm"
            >
              {mode === 'checkbox' ? (
                <>
                  <input
                    type="checkbox"
                    id="show_password"
                    name="show_password"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <label htmlFor="show_password">Show password</label>
                </>
              ) : (
                <span
                  tabIndex={0}
                  onClick={() => setShowPassword(!showPassword)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setShowPassword(!showPassword);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: '10%',
                    padding: ' 10px',
                    cursor: ' pointer',
                    marginInlineStart: '-35px', // Add cursor style to indicate clickable element
                  }}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </span>
              )}
            </div>
          )}
        </div>
      </>
    );

    return (
      <div
        style={{
          maxWidth: 'inherit',
        }}
        className={`grid w-full items-center gap-1.5`}
      >
        {label && <Label htmlFor={props.id}>{label}</Label>}
        {inputComponent}
      </div>
    );
  }
);

InputPro.displayName = 'InputPro';
export default InputPro;
