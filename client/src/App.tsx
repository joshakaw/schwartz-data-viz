import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TestList from './components/testlist/testlist'
import AccountDataTable from './components/accountDataTable/accountDataTable'

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
          <AccountDataTable data={[{ ssid: 1, first_name: "John", last_name: "Doe", email: "exampl.gmail.com", phone: 1234567890, school: "Example School", account_type: "Student", creation_date: "2023-01-01", sessions: 5, recent_session: "2023-10-01", recent_subject: "Math", recent_tutor: "Jane Smith" }]} />
    </>
  )
}

export default App
