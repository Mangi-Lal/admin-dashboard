
import './App.css';
import { useEffect, useState } from 'react'
import bin from './asset/img/trash-bin.png'
import bin2 from './asset/img/bin2.png'
import edit from './asset/img/editing.png'
import {debounce} from 'lodash'
import search from './asset/img/search.png'

function App() {

  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [totalPages, setTotalPages] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedrows, setSelectedRows] = useState([])
  const [editable , seteditable] = useState()

  useEffect(() => {
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setFilteredData(data)
      })      
  }, [])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  useEffect(() => {
    let pages = []
    for(let i=0; i<Math.ceil(filteredData.length/10); i++){
      pages.push(i+1)
    }
    setTotalPages(pages)
  } , [filteredData])

const delteRows = () => {
  let newData = data.filter((item) => !selectedrows.includes(item.id))
  setData(newData)
  setFilteredData(newData)
  setSelectedRows([])
}

const searchData = (searchValue) => {
  if (searchValue === '')
  {
    setFilteredData(data)
  }
  else{
    let newData = data.filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase()) || item.email.toLowerCase().includes(searchValue.toLowerCase()) || item.role.toLowerCase().includes(searchValue.toLowerCase()))
    setFilteredData(newData)
    setCurrentPage(0)
  }
}



  return (
    <div className="App p-5 flex flex-col space-y-4 font-mono">
      <div className="flex justify-between ">
        <span className='search-icon w-1/3 flex items-center'>
        <input 
        id='searchdata' 
        onChange={
          (e) => {
          if(e.target.value === '')
          {
            setFilteredData(data)
          }}}
        onKeyPress={
          (e) => {
            if (e.key === 'Enter')
            {
              searchData(e.target.value)
            }
          }
        }
        type="text" className="border border-gray-300 shadow-[0px_0px_20px_2px_#a0a0a040] outline-none rounded-md p-2 w-full" placeholder="Enter Value..." />
        <img src={search} alt="" onClick={
          () => {
            searchData(document.querySelector('#searchdata').value)
          }
        } className='h-4 w-4 cursor-pointer -translate-x-[150%]' style={{
          filter: "invert(30%)"
        }} />
        </span>
        <button onClick={
          () => {
            window.confirm('Are you sure you want to delete these rows?') &&
            delteRows()
          }
        } disabled={selectedrows.length === 0 ? true : false } 
        className="delete disabled:bg-red-400 bg-red-500 text-white shadow-[0px_0px_20px_2px_#a0a0a040] rounded-md p-2 w-[3rem] aspect-square">
          <img className="w-full drop-shadow-3xl h-full" 
           style={
            {
              filter: "invert(100%)"
            }
          } 
          src={bin} alt="bin" />
        </button>
      </div>
      <table className='outline outline-1 rounded-md  outline-gray-300  shadow-[0px_0px_40px_1px_#a0a0a040] '>
        <thead>
          <th className='w-[5%]'><input  onClick={
          () => {
            if (selectedrows.length > 0)
            {
              setSelectedRows([])
            }
            else{
              setSelectedRows(
                filteredData.slice(currentPage*10 , currentPage*10 + 10).map((item) => item.id)
              )
            }
          }
        } type='checkbox' checked={selectedrows.length === 10 ? true:false} className='h-[0.9rem] w-[0.9rem]'/></th>
          <th className='w-[30%]'>Name</th>
          <th className='w-[30%]'>Email</th>
          <th className='w-[15%]'>Role</th>
          <th className='w-[15%]'>Actions</th>
        </thead>
        <tbody>
          {filteredData.length > 0 && filteredData.slice(currentPage*10 , currentPage*10 + 10   ).map((item, index) =>{
            return (
             <tr className={`cursor-pointer hover:bg-gray-100 text-[0.95rem] ${selectedrows.includes(item.id) ? 'bg-gray-100' : ''}`}
              key={index}>
             <td  onClick={
                () => {
                  if (selectedrows.includes(item.id))
                  {
                    setSelectedRows(selectedrows.filter((id) => id !== item.id))
                  }
                  else{
                    setSelectedRows([...selectedrows, item.id])
                  }
                }
             } ><input checked={selectedrows.includes(item.id)? true:false} value={selectedrows.includes(item.id)}  type='checkbox' className='h-[0.9rem] w-[0.9rem]'/></td>
             <td>{editable === item.id ? <input defaultValue={item.name} onKeyPress={
              (e) => {
                if (e.key === 'Enter')
                {
                  seteditable('')
                }
              }
             }
             onBlur={
              () => {
                seteditable('')
              }
             } onChange={(e) => {
                let newData = data.map((item2) => {
                  if (item2.id === item.id)
                  {
                    item2.name = e.target.value
                  }
                  return item2
                })
                setData(newData)
                setFilteredData(newData)
             }}/> : item.name}</td>
             <td>{editable === item.id ? <input defaultValue={item.email} onKeyPress={
              (e) => {
                if (e.key === 'Enter')
                {
                  seteditable('')
                }
              }
             }
             onBlur={
              () => {
                seteditable('')
              }
             }
             onChange={(e) => {
                let newData = data.map((item2) => {
                  if (item2.id === item.id)
                  {
                    item2.email = e.target.value
                  }
                  return item2
                })
                setData(newData)
                setFilteredData(newData)
             }}/> :item.email}</td>
             <td>{editable === item.id ? <input defaultValue={item.role} onKeyPress={
              (e) => {
                if (e.key === 'Enter')
                {
                  seteditable('')
                }
              }
             }
             onBlur={
              () => {
                seteditable('')
              }
             } onChange={(e) => {
                let newData = data.map((item2) => {
                  if (item2.id === item.id)
                  {
                    item2.role = e.target.value
                  }
                  return item2
                })
                setData(newData)
                setFilteredData(newData)
             }}/> :item.role}</td>
             <td className='flex space-x-2'>
             <button  className="edit border rounded-md p-[0.45rem] w-[2rem] shadow-sm border-gray-300 aspect-square">
           <img onClick={
              () => {
                seteditable(item.id === editable ? '' : item.id)
              }
           } className="w-full drop-shadow-3xl h-full" 
           src={edit} alt="edit" />
         </button>
         <button className="delete border rounded-md p-[0.15rem] w-[2rem] shadow-sm border-gray-300 aspect-square">
           <img className="w-full drop-shadow-3xl h-full" 
           onClick={
            () => {
              window.confirm('Are you sure you want to delete this row?') &&
              setData(data.filter((item2) => item2.id !== item.id)) && setFilteredData(filteredData.filter((item2) => item2.id !== item.id))
            }
           }
           src={bin2} alt="bin" />
         </button>
             </td>
           </tr>
            )
          })}
         
        </tbody>
      </table>
      <div className="pagenumbers flex justify-between px-2 text-[0.9rem]">
        <span className='text-gray-400'>{selectedrows.length} of {filteredData.length} row(s) selected</span>
        <div className='flex space-x-4 items-center text-[0.9rem]'>
          <span>Page {currentPage+1} of {totalPages.length}</span>
          <div className='flex button-grp text-sm space-x-2' >
          <button className='first-page' title='more_previous'
           onClick={
            () => {
              setCurrentPage(0)
            }
          }
          > &lt;&lt; </button>
          <button className='previous-page' title='previous' 
           onClick={
            () => {
              if (currentPage > 0)
              {
              setCurrentPage(currentPage-1)
            }
            }
          }
          > &lt; </button>
          {totalPages.map((item, index) =>{
            return (
              <button onClick={
                () => {
                  if (currentPage < totalPages.length-1)
                  {
                  setCurrentPage(index)
                }
                }
              } 
              key={index} className={
                `border rounded-md p-[0.15rem] w-[2rem] shadow-sm border-gray-300 aspect-square 
                ${currentPage === index ? '' : 'bg-white text-gray-500'}`
              } title={index+1}>{item}</button>
            )
          })}
          <button className='next-page' title='next' onClick={
            () => {
              if (currentPage < totalPages.length-1)
              {
              setCurrentPage(currentPage+1)
            }
            }
          }> &gt; </button>
          <button className='last-page' title='next_jump'
          onClick={
            () => {
              setCurrentPage(totalPages.length-1)
            }
          }
          > &gt;&gt; </button>
          </div> 
        </div>
      </div>
    </div>
  );
}

export default App;
