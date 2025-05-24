from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from Database import add_teacher, verify_teacher, get_attendance_by_teacher, get_db_connection

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def mark_attendance(docente_id, tipo):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("INSERT INTO asistencia (docente_id, tipo) VALUES (%s, %s)", (docente_id, tipo))
    connection.commit()
    cursor.close()
    connection.close()
    return True


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
    if foto:
        foto_filename = f"{dni}_{foto.filename}"
        foto_path = os.path.join(app.config['UPLOAD_FOLDER'], foto_filename)
        foto.save(foto_path)
    
    if add_teacher(nombre, dni, correo, celular, foto_path):
        return jsonify({'message': 'Docente agregado correctamente'}), 201
    return jsonify({'error': 'Error al agregar docente'}), 500


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
    # Verificar última asistencia para determinar si es entrada o salida
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


if __name__ == '__main__':
    app.run(debug=True, port=5000)
