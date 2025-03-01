import "../../styles/details/AntibioticStats.css";

const AntibioticsTable = ({ data }) => {
  const rows = [];
  let totalAntibioticsAcrossAllAnimals = 0;
  data.forEach((item) => {
    if (item.species === "All Animals") {
      totalAntibioticsAcrossAllAnimals = item.totalAntibiotics;
    } else {
      rows.push(
        <tr key={item.species}>
          <td>{item.species}</td>
          <td>{item.totalAntibiotics}</td>
          <td>{item.avgAntibioticsPerAnimalPerSpecies}</td>
        </tr>
      );
    }
  });

  return (
    <div className="report-content">
      <div>
        <h3>Antibiotics Usage by Species</h3>
        <hr />
        <p className="total-antibiotics">
          Total Antibiotics Used Across All Animals:{" "}
          {totalAntibioticsAcrossAllAnimals}
        </p>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Species</th>
              <th>Total Antibiotics</th>
              <th>Avg Antibiotics Per Animal</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );
};

export default AntibioticsTable;
