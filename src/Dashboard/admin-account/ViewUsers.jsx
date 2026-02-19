import React from 'react'
import useGetProfile from '../../hooks/useFetchData'
import { BASE_URL } from '../../config'
import Loading from '../../components/Loader/Loading'
import Error from '../../components/Error/Error'

const ViewUsers = () => {
  const { data, loading, error } = useGetProfile(BASE_URL + '/users/')

  return (
    <div>
      <br />
      <br />
      {loading && <Loading />}
      {error && <Error errMessage={error} />}
      {!loading && !error && data && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No of Appointments
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Group
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map(item => (
                <tr key={item?._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={item?.photo} alt="User" className="h-10 w-10 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* FIX: was item.gender.toUpperCase() — crashes if gender is null/undefined */}
                    <div className="text-sm text-gray-900">
                      {item?.gender ? item.gender.toUpperCase() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item?.bookingsCount ?? 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item?.bloodType ?? 'N/A'}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && data?.length === 0 && (
        <h2 className='mt-5 text-center text-primaryColor text-[20px] leading-7 font-semibold'>
          No patients found
        </h2>
      )}
    </div>
  )
}

export default ViewUsers