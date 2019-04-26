import PropTypes from 'prop-types'
import useFormin from './use-formin'

export default function Formin({ children, ...rest }) {
  const formin = useFormin(rest)

  return children(formin)
}

Formin.propTypes = {
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({}),
  values: PropTypes.shape({}),
}
