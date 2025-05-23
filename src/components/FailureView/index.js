// src/components/FailureView/index.js
import './index.css'

const FailureView = ({retry}) => (
  <div>
    <p>Something went wrong! Please try again.</p>
    <button type="button" onClick={retry}>
      Retry
    </button>{' '}
    {/* Ensure retry is a prop or defined */}
  </div>
)

export default FailureView
