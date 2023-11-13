import React, { useState, createContext, useContext } from 'react';

export const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [avatar, setAvatar] = useState();

  return (
    <AvatarContext.Provider value={{ avatar, setAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};