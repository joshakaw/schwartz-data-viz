import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TestList from './components/testlist/testlist'
import AccountDataTable from './components/accountDataTable/accountDataTable'
import BarChart from './components/bar-chart/bar-chart'

function App() {
  const [count, setCount] = useState(0)

  return (
      <>
          <div>
          </div>
          <div>
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>

          <TestList />
          <BarChart />
          <AccountDataTable />
    </>
  )
}

export default App
