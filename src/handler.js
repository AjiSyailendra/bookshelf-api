const books = require('./books')
const { nanoid } = require('nanoid')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading } = request.payload

  const id = nanoid(16)

  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook)

  const isSuccess = books.filter((n) => n.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id
      }
    })

    response.code(201)
    return response
  }
}

const getAllBooksHandler = (request, h) => {
  const book = []

  books.map((n) => {
    const { id, name, publisher } = n
    book.push({ id, name, publisher })
  })

  const response = h.response({
    status: 'success',
    data: {
      book
    }
  })
  response.code(200)
  return response
}


const getBooksByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((n) => n.id === bookId)[0]
  console.log(bookId);
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading } = request.payload

  const updatedAt = new Date().toISOString();

  const index = books.filterIndex((note) => note.id === bookId);

  if (!name) {
    const response = h.response({
      "status": "fail",
      "message": "Gagal memperbarui buku. Mohon isi nama buku"
    })
    response.code(200)
    return response
  }


  if (index !== -1) {
    if (!name) {
      const response = h.response({
        "status": "fail",
        "message": "Gagal memperbarui buku. Mohon isi nama buku"
      })
      response.code(200)
      return response
    }

    if (readPage > pageCount) {
      const response = h.response({
        "status": "fail",
        "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
      })
      response.code(200)
      return response
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: "Buku berhasil diperbarui"
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
}

const deleteBookById = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((n) => n.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)

    const response = h.response({
      status: 'success',
      message: "Buku berhasil dihapus"
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    "message": "Buku gagal dihapus. Id tidak ditemukan"
  })
  response.code(404)
  return response
}


module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBookByIdHandler,
  deleteBookById,
}