import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  // Contenedores
  modal_background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 24,
  },
  modal_container: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    width: '100%',
  },

  // Texto
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  error: {
    color: 'red',
    marginBottom: 8,
    fontSize: 14,
    textAlign: 'center'
  },
  cancel_text: {
    color: '#000',
    fontWeight: '500'
  },
  submit_text: {
    color: '#fff',
    fontWeight: '500'
  },

  // Estrellas
  stars_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  star_button: {
    marginHorizontal: 2,
  },

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    textAlignVertical: 'top'
  },

  // Botones
  button_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancel_button: {
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  submit_button: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  star_wrapper: {
  position: 'relative',
  width: 28,
  height: 28,
  marginHorizontal: 2,
  alignItems: 'center',
  justifyContent: 'center',
},

half_star_left: {
  position: 'absolute',
  left: 0,
  top: 0,
  width: 14, // mitad del ícono
  height: 28,
  zIndex: 1,
},

half_star_right: {
  position: 'absolute',
  right: 0,
  top: 0,
  width: 14,
  height: 28,
  zIndex: 1,
},

})
