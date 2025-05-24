import cv2
import face_recognition
import os
import numpy as np
import time
from Database import get_db_connection, verify_teacher, mark_attendance


def load_known_faces(faces_folder):
    known_face_encodings = []
    known_face_ids = []
    
    for filename in os.listdir(faces_folder):
        if filename.endswith('.jpg'):
            dni = filename.split('_')[0]
            image_path = os.path.join(faces_folder, filename)
            image = face_recognition.load_image_file(image_path)
            encoding = face_recognition.face_encodings(image)
            if encoding:
                known_face_encodings.append(encoding[0])
                known_face_ids.append(dni)
            else:
                print(f"Advertencia: No se detectó rostro en {filename}")
    
    return known_face_encodings, known_face_ids


def main():
    faces_folder = 'faces'
    known_face_encodings, known_face_ids = load_known_faces(faces_folder)
    
    if not known_face_encodings:
        print("Error: No se encontraron rostros conocidos en la carpeta 'faces'")
        return
    
    # Configurar cámara con resolución y FPS optimizados
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: No se pudo abrir la cámara")
        return
    
    # Reducir resolución para mejorar velocidad
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    cap.set(cv2.CAP_PROP_FPS, 30)
    
    print("Cámara en espera. Acérquese para registrar asistencia.")
    
    last_attendance_time = 0  # Timestamp de la última asistencia registrada
    COOLDOWN_SECONDS = 10  # Tiempo de espera entre registros
    FRAME_SCALE = 0.25  # Escala para reducir frames y mejorar velocidad
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: No se pudo capturar el video")
            break
        
        # Reducir tamaño del frame para acelerar procesamiento
        small_frame = cv2.resize(frame, (0, 0), fx=FRAME_SCALE, fy=FRAME_SCALE)
        rgb_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
        
        # Procesar rostros solo si ha pasado el tiempo de cooldown
        current_time = time.time()
        if current_time - last_attendance_time >= COOLDOWN_SECONDS:
            face_locations = face_recognition.face_locations(rgb_frame, model="hog")  # Usar modelo HOG para mayor velocidad
            
            # Procesar solo si hay exactamente un rostro
            if len(face_locations) == 1:
                face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
                face_encoding = face_encodings[0]  # Solo un rostro
                
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
                
                if True in matches:
                    match_index = matches.index(True)
                    dni = known_face_ids[match_index]
                    teacher = verify_teacher(dni)
                    
                    if teacher:
                        connection = get_db_connection()
                        if not connection:
                            print("Error: No se pudo conectar a la base de datos")
                            cv2.putText(frame, "Error: Sin conexión a BD", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                        else:
                            cursor = connection.cursor(dictionary=True)
                            cursor.execute("SELECT tipo FROM asistencia WHERE docente_id = %s ORDER BY fecha_hora DESC LIMIT 1", (teacher['id'],))
                            last_attendance = cursor.fetchone()
                            cursor.close()
                            connection.close()
                            
                            tipo = 'entrada' if not last_attendance or last_attendance['tipo'] == 'salida' else 'salida'
                            
                            if mark_attendance(teacher['id'], tipo):
                                print(f"Asistencia ({tipo}) registrada para {teacher['nombre']} (DNI: {dni}) a las {time.strftime('%Y-%m-%d %H:%M:%S')}")
                                cv2.putText(frame, f"Asistencia ({tipo}) registrada", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                                last_attendance_time = current_time
                            else:
                                print(f"Error al registrar asistencia para {teacher['nombre']} (DNI: {dni})")
                                cv2.putText(frame, "Error al registrar asistencia", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                    else:
                        print(f"Docente con DNI {dni} no encontrado en la base de datos")
                        cv2.putText(frame, "Docente no encontrado", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                else:
                    print("Rostro detectado pero no reconocido")
                    cv2.putText(frame, "Rostro no reconocido", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            elif len(face_locations) > 1:
                print("Error: Se detectaron múltiples rostros. Solo se permite uno.")
                cv2.putText(frame, "Error: Múltiples rostros detectados", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            else:
                cv2.putText(frame, "Esperando docente...", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        else:
            # Mostrar tiempo restante en cooldown
            remaining = int(COOLDOWN_SECONDS - (current_time - last_attendance_time) + 1)
            cv2.putText(frame, f"Espere {remaining}s para el siguiente registro", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
        cv2.imshow('Asistencia', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    main()
