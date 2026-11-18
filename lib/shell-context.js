'use client';
import { createContext, useContext } from 'react';

export const ShellCtx = createContext({ go: () => {}, ready: false });
export const useShell = () => useContext(ShellCtx);
