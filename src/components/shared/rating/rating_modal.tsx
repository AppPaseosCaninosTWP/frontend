import React, { useState } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { styles } from './rating_modal.styles'

interface RatingModalProps {
  visible: boolean
  on_close: () => void
  on_submit: (rating: number, comment: string) => void
}

export const RatingModal: React.FC<RatingModalProps> = ({ visible, on_close, on_submit }) => {
  const [rating, set_rating] = useState(0)
  const [comment, set_comment] = useState('')
  const [error, set_error] = useState('')

  const handle_star_press = (value: number) => {
    set_rating(value)
    set_error('')
  }

  const handle_submit = () => {
    if (rating > 0 && comment.trim() === '') {
      set_error('El comentario es obligatorio si calificas al paseo.')
      return
    }
    on_submit(rating, comment.trim())
    set_rating(0)
    set_comment('')
    on_close()
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modal_background}>
        <View style={styles.modal_container}>
          <Text style={styles.title}>Califica tu experiencia</Text>

<View style={styles.stars_container}>
  {[1, 2, 3, 4, 5].map((value) => {
    const full_value = value;
    const half_value = value - 0.5;

    let icon_name = 'star-o';
    if (rating >= full_value) {
      icon_name = 'star';
    } else if (rating >= half_value) {
      icon_name = 'star-half-o';
    }

    return (
      <View key={value} style={styles.star_wrapper}>
        {/* izquierda = media estrella */}
        <TouchableOpacity
          style={styles.half_star_left}
          onPress={() => handle_star_press(half_value)}
        />
        {/* derecha = estrella entera */}
        <TouchableOpacity
          style={styles.half_star_right}
          onPress={() => handle_star_press(full_value)}
        />
        <FontAwesome name={icon_name as any} size={28} color="#FFD700" />
      </View>
    );
  })}
</View>




          <TextInput
            style={styles.input}
            placeholder="Escribe un comentario..."
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={set_comment}
            maxLength={250}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.button_container}>
            <TouchableOpacity onPress={on_close} style={styles.cancel_button}>
              <Text style={styles.cancel_text}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handle_submit} style={styles.submit_button}>
              <Text style={styles.submit_text}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}