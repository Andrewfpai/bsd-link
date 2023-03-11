import {useState, useEffect} from 'react'
import { useQuery } from '@tanstack/react-query'
import useDebounce from '../hooks/useDebounce'

export const Search = () => {

    const [search, setSearch] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const debouncedSearchTerm = useDebounce(search, 200)

    const {data, isLoading, error} = useQuery({
      queryKey: ['search'],
      queryFn: () => (
          fetch(`https://raw.githubusercontent.com/Andrewfpai/bsd-link-library/main/bsd-link.json`)
            .then(res => res.json())
      ),
        })

        useEffect(() => {
          
          const filtered = data?.nama_halte?.filter(item => {
            if (debouncedSearchTerm === '') {
              return item;
            } else {
          
              return item?.toLowerCase()?.includes(debouncedSearchTerm.toLowerCase());
            }
          });
   
          setFilteredData(filtered || []);
        }, [data, debouncedSearchTerm]);

        
  
    if (isLoading) return 'Loading...'
  
    if (error) return 'An error has occurred: ' + error.message

    

  return (
    <div className="Search">
      <input
        name="search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        />
      <div>

      
      {filteredData?.map((item) => <p key={item.id}>{item}</p>)}
    
      
        
      </div>
  
    </div>
  );
}







