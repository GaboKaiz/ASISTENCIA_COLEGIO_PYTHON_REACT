from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import cv2
import face_recognition
from Database import add_teacher, verify_teacher, mark_attendance, get_attendance_by_teacher, get_db_connection

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'Uploads'
FACES_FOLDER = 'faces'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['FACES_FOLDER'] = FACES_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(FACES_FOLDER, exist_ok=True)


@app.route('/api/teachers', methods=['GET'])
def get_teachers():
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor(dictionary=True)
            query = "SELECT id, nombre, dni, correo, celular, foto FROM docentes"
            cursor.execute(query)
            teachers = cursor.fetchall()
            cursor.close()
            connection.close()
            # Asegura que la ruta de la foto sea accesible
            for teacher in teachers:
                if teacher['foto']:
                    teacher['foto'] = f"/Uploads/{os.path.basename(teacher['foto'])}"
            return jsonify(teachers), 200
        except Exception as e:
            print(f"Error: {e}")
            return jsonify({'error': 'Error al obtener docentes'}), 500
    return jsonify({'error': 'Error de conexión a la base de datos'}), 500


@app.route('/api/teachers', methods=['POST'])
def add_teacher_api():
    data = request.form
    nombre = data.get('nombre')
    dni = data.get('dni')
    correo = data.get('correo')
    celular = data.get('celular')
    foto = request.files.get('foto')
    
    if not all([nombre, dni, correo, celular]):
        return jsonify({'error': 'Faltan datos requeridos'}), 400
    
    foto_path = None
    face_path = None
    if foto:
        # Usar DNI y nombre para el nombre del archivo
        foto_filename = f"{dni}_{nombre}.jpg"
        foto_path = os.path.join(app.config['UPLOAD_FOLDER'], foto_filename)
        face_filename = f"{dni}_face.jpg"
        face_path = os.path.join(app.config['FACES_FOLDER'], face_filename)
        foto.save(foto_path)
        
        # Procesar la imagen para extraer el rostro
        image = cv2.imread(foto_path)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_image)
        
        if face_locations:
            top, right, bottom, left = face_locations[0]
            face_image = image[top:bottom, left:right]
            cv2.imwrite(face_path, face_image)
        else:
            return jsonify({'error': 'No se detectó un rostro en la imagen'}), 400
    
    if add_teacher(nombre, dni, correo, celular, foto_path):
        return jsonify({'message': 'Docente agregado correctamente'}), 201
    return jsonify({'error': 'Error al agregar docente'}), 500


@app.route('/Uploads/<filename>')
def serve_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/api/verify', methods=['POST'])
def verify_teacher_api():
    data = request.json
    dni = data.get('dni')
    teacher = verify_teacher(dni)
    if teacher:
        return jsonify(teacher), 200
    return jsonify({'error': 'Docente no encontrado'}), 404


@app.route('/api/attendance', methods=['POST'])
def mark_attendance_api():
    data = request.json
    docente_id = data.get('docente_id')
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT tipo FROM asistencia WHERE docente_id = %s ORDER BY fecha_hora DESC LIMIT 1", (docente_id,))
    last_attendance = cursor.fetchone()
    cursor.close()
    connection.close()
    
    tipo = 'entrada' if not last_attendance or last_attendance['tipo'] == 'salida' else 'salida'
    
    if mark_attendance(docente_id, tipo):
        return jsonify({'message': f'Asistencia ({tipo}) marcada correctamente'}), 200
    return jsonify({'error': 'Error al marcar asistencia'}), 500


@app.route('/api/attendance', methods=['GET'])
def get_attendance_api():
    nombre = request.args.get('nombre', '')
    attendance = get_attendance_by_teacher(nombre)
    return jsonify(attendance), 200


@app.route('/api/stats', methods=['GET'])
def get_stats():
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT COUNT(DISTINCT id) as teacher_count FROM docentes")
            teacher_count = cursor.fetchone()['teacher_count']
            cursor.close()
            connection.close()
            return jsonify({'teacher_count': teacher_count}), 200
        except Exception as e:
            print(f"Error: {e}")
            return jsonify({'error': 'Error al obtener estadísticas'}), 500
    return jsonify({'error': 'Error de conexión a la base de datos'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
