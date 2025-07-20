import React from 'react'
import { FluentProvider, webLightTheme, Button, Title3 } from '@fluentui/react-components'

const SimpleDemo: React.FC = () => {
  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ 
        height: '100vh', 
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        backgroundColor: '#f5f5f5'
      }}>
        <Title3>Flows Editor Demo</Title3>
        <p>Welcome to the Flows Editor!</p>
        <Button appearance="primary">
          Get Started
        </Button>
        <p>This is a simple demo to test the basic setup.</p>
      </div>
    </FluentProvider>
  )
}

export default SimpleDemo 