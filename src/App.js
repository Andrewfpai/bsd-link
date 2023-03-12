import './App.css';
import Search from './components/search'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'




const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <div className="d-flex flex-row">
        <Search />
  
      </div>
      
    </QueryClientProvider>
  )
}



export default App;
