import './App.css';
import {Search} from './components/search'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'


const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Search />
      {/* <Example /> */}
    </QueryClientProvider>
  )
}



export default App;
