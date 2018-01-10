if(window.openDatabase)
{
    var mydb = openDatabase("notepad_db", "0.1", "browser built in database for notepad", 1024 * 1024);

    mydb.transaction(function(t){
        t.executeSql("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY ASC, note TEXT)");
    });
} 
else
{
    alert("WebSQL is not supported");
}

function AddNote() 
{
    if(mydb)
    {
        var NoteInput = document.getElementById('NoteInput').value;
        if(NoteInput !== '')
        {
            mydb.transaction(function(t){
                t.executeSql("INSERT INTO notes (note) VALUES (?)", [NoteInput]);
                document.getElementById('NoteInput').value = '';
                OutputNotes();
                BackToNotes();
            });
        } 
        else 
        {
            alert("Write something");
        }
    } 
    else 
    {
        alert("db not found, your browser does not support web sql!");
    }
}

function OutputNotes() 
{
    if(mydb)
    {
        mydb.transaction(function(t){
            t.executeSql("SELECT * FROM notes", [], UpdateNoteList);
        });
    } 
    else
    {
        alert("db not found, your browser does not support web sql!");
    }
}

function UpdateNoteList(transaction, results){
    var NoteList = document.getElementById("NoteList");   
    NoteList.innerHTML = '';
    
    for(var i = 0; i < results.rows.length; i++)
    {
        var row = results.rows.item(i);
        row.note = row.note.substring(0, 40);
        NoteList.innerHTML += "<a class='NoteListCollItem collection-item'>" + row.note + "<span class='ReadNoteBtn' onclick='ReadNote(" + row.id + ");'><i class='ReadNoteBtnIcon material-icons'>description</i></span>" + "<span class='DeleteBtn' onclick='DeleteNote(" + row.id + ");'><i class='DeleteBtnIcon material-icons'>delete</i></span></a>";
    }
}

function DeleteNote(id)
{
    if(mydb)
    {
        mydb.transaction(function(t){
            t.executeSql("DELETE FROM notes WHERE id=?", [id], OutputNotes);
        });
    } 
    else 
    {
        alert("db not found, your browser does not support web sql!");
    }
}

function WriteNote()
{
    document.getElementById('WriteNoteBtn').style.display = 'none';
    document.getElementById('NoteListPanel').style.display = 'none';
    document.getElementById('WriteNotePanel').style.display = 'block';
    document.getElementById('NoteInput').focus();
    document.getElementById('BackToNotesBtn').style.display = 'inline-block';
}

function BackToNotes()
{
    document.getElementById('WriteNoteBtn').style.display = 'inline-block';
    document.getElementById('NoteListPanel').style.display = 'block';
    document.getElementById('WriteNotePanel').style.display = 'none';
    document.getElementById('ReadNotePanel').style.display = 'none';
    document.getElementById('BackToNotesBtn').style.display = 'none';
}

function ReadNote(id) 
{
    if(mydb)
    {
        mydb.transaction(function(t){
            t.executeSql("SELECT * FROM notes WHERE id=?", [id], function(transaction, results){
                document.getElementById('SpecificNote').innerHTML = results.rows.item(0).note;
                document.getElementById('NoteListPanel').style.display = 'none';
                document.getElementById('ReadNotePanel').style.display = 'block';
                document.getElementById('BackToNotesBtn').style.display = 'block';
                document.getElementById('WriteNoteBtn').style.display = 'none';
            });
        });
    }
    else
    {
        alert("db not found, your browser does not support web sql!");
    }
}

OutputNotes();