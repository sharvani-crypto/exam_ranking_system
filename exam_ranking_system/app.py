from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/exam')
def exam():
    return render_template('exam.html')

@app.route('/result')
def result():
    return render_template('result.html')

@app.route('/history')
def history():
    return render_template('history.html')

@app.route('/instructions')
def instructions():
    return render_template('instructions.html')

@app.route('/leaderboard')
def leaderboard():
    return render_template('leaderboard.html')

if __name__ == '__main__':
    app.run(debug=True)