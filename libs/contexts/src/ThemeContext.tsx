import React, {createContext, useContext} from 'react'

export const ThemeContext = createContext({themeValue: 'themeKey'})

export const ThemeProvider = ({children, data}: any) => {
  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>
}

export const useThemeState = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeState must be used within a ThemeProvider')
  }
  return context
}
