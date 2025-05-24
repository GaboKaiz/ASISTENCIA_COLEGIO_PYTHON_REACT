import cv2
import face_recognition
import os
import numpy as np
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
    
    return known_face_encodings, known_face_ids


def main():
    faces_folder = 'faces'
    known_face_encodings, known_face_ids = load_known_faces(faces_folder)
    
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: No se pudo abrir la cámara")
        return
    
    print("Cámara en espera. Acérquese para registrar asistencia.")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: No se pudo capturar el video")
            break
        
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_frame)
        
        if face_locations:
            face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
            
            for face_encoding in face_encodings:
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
                
                if True in matches:
                    match_index = matches.index(True)
                    dni = known_face_ids[match_index]
                    teacher = verify_teacher(dni)
                    
                    if teacher:
                        connection = get_db_connection()
                        cursor = connection.cursor(dictionary=True)
                        cursor.execute("SELECT tipo FROM asistencia WHERE docente_id = %s ORDER BY fecha_hora DESC LIMIT 1", (teacher['id'],))
                        last_attendance = cursor.fetchone()
                        cursor.close()
                        connection.close()
                        
                        tipo = 'entrada' if not last_attendance or last_attendance['tipo'] == 'salida' else 'salida'
                        
                        if mark_attendance(teacher['id'], tipo):
                            print(f"Asistencia ({tipo}) registrada para {teacher['nombre']} (DNI: {dni})")
                            cv2.putText(frame, f"Asistencia ({tipo}) registrada", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                            cv2.imshow('Asistencia', frame)
                            cv2.waitKey(2000)  # Mostrar mensaje durante 2 segundos
                            break
        
        cv2.imshow('Asistencia', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    main()
