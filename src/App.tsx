import './App.css';
import Schedular from './schedular';

function App() {
  return (
    <div className="App">
      <Schedular
        events={[]}
        onCellClick={() => { }}
        onTaskClick={() => { }}
        onEventsChange={() => { }}
        onAlertCloseButtonClicked={() => { }}
        options={{ currentDate: "2022-03-21" }}
      />
    </div>
  );
}

export default App;
