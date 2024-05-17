export const TableGastos = ({ gastos }) => {
  console.log(gastos);
  return (
    <div>
      <div className="bg-white py-5 px-5 my-5 mx-3 max-w-md">
        <p className="text-xs font-bold text-blue-500">Filtrador de gastós</p>
      </div>
      <div className="overflow-x-auto bg-white my-2 mx-3">
        <table className="table">
          <thead>
            <tr className="text-gray-800">
              <th>Referencia</th>
              <th>Fecha</th>
              <th>Proveedor</th>
              <th>Categoria</th>
              <th>Estado</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {gastos?.map((g) => (
              <tr key={g._id}>
                <th>1</th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td>Blue</td>
                <td>Blue</td>
                <td>Blue</td>
                <td>Blue</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
