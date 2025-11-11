// src/hooks/useHotkeys.ts
'use client';

import { useEffect } from 'react';
import hotkeys, { KeyHandler } from 'hotkeys-js';

export const useHotkeys = (keys: string, callback: KeyHandler, deps: any[] = []) => {
  useEffect(() => {
    // Definir el atajo
    hotkeys(keys, callback);

    // Limpieza: desvincular el atajo cuando el componente se desmonte
    return () => {
      hotkeys.unbind(keys, callback);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, callback, ...deps]); // Volver a vincular si las dependencias cambian
};