import {useState, useEffect} from 'react'
import { useQuery } from '@tanstack/react-query'
import useDebounce from '../hooks/useDebounce'
import { Flex, Spacer } from '@chakra-ui/react'

export default function Search(){

    const [titikAwal, setTitikAwal] = useState('')
    const [tujuan, setTujuan] = useState('')
    const [search, setSearch] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const debouncedSearchTerm = useDebounce(search, 1000)

    const {data, isLoading, error} = useQuery({
      queryKey: ['data_halte'],
      queryFn: () => {
          console.log("fetch")
          return fetch(`https://raw.githubusercontent.com/Andrewfpai/bsd-link-library/main/bsd-link.json`)
            .then(res => res.json())
      },
        })

        useEffect(() => {
          console.log("tes")
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
      <Flex gap="20">
        <div className="titikAwal">
          <input
            name="search"
            value={search}
            onChange={(e) => {setSearch(e.target.value);}}
            />
          {filteredData?.map((item, index) => 
            <p onClick={()=>{setTitikAwal(item)}} key={index}>{item}</p>
          )}
        </div>

        <div className="tujuan">
          <input
            name="search"
            value={search}
            onChange={(e) => {setSearch(e.target.value);}}
            />
          {filteredData?.map((item, index) => 
            <p onClick={()=>{setTujuan(item)}} key={index}>{item}</p>
          )}
        </div>

        <p>{titikAwal}</p>
       
        <p>{tujuan}</p>
      
      </Flex>

      

    </div>
  );
}







