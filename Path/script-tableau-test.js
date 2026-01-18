(() => {
    // Sélectionne tous les tableaux créés dans les blocs
    const tables = document.querySelectorAll('.bloc table.missions-table');

    const sampleRows = `
      <tr>
        <td>54790144</td>
        <td>Train 123</td>
        <td>4-2135</td>
        <td>60CAS</td>
        <td>21</td>
        <td>70.770</td>
        <td>Est attribuée</td>
      </tr>
      <tr>
        <td>54790570</td>
        <td>Train 456</td>
        <td>4-2159</td>
        <td>60MON</td>
        <td>27</td>
        <td>83.000</td>
        <td>Attente</td>
      </tr>
      <tr>
        <td>54790574</td>
        <td>Train 789</td>
        <td>4-2167</td>
        <td>60MON</td>
        <td>26</td>
        <td>72.060</td>
        <td>Attente</td>
      </tr>
      <tr>
        <td>54790150</td>
        <td>Train 101</td>
        <td>4-2140</td>
        <td>60CAS</td>
        <td>15</td>
        <td>45.500</td>
        <td>Est attribuée</td>
      </tr>
            <tr>
        <td>54790150</td>
        <td>Train 101</td>
        <td>4-2140</td>
        <td>60CAS</td>
        <td>15</td>
        <td>45.500</td>
        <td>Est attribuée</td>
      </tr>
        <tr>
        <td>54790150</td>
        <td>Train 101</td>
        <td>4-2140</td>
        <td>60CAS</td>
        <td>15</td>
        <td>45.500</td>
        <td>Est attribuée</td>
      </tr>
  
  

    `;

    tables.forEach(table => {
        const tbody = table.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = sampleRows;
        }
    });
})();
