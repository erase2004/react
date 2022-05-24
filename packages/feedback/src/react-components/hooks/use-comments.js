import React, { useState, useRef, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid';

import { getFeedbacks, postFeedback } from '../api'
import useUser from './use-user'

const initialCommentCount = 3
const moreCommentCount = 10

export default function useComments(formId, fieldId) {
  console.log('useComments', formId, fieldId)
  const [showingComments, setShowingComments] = useState([])
  const [noMoreComment, setNoMoreComment] = useState(false)
  const hidingCommentsRef = useRef([])
  const skipRef = useRef(0)
  const takeRef = useRef(initialCommentCount + 2 * moreCommentCount)
  const { userId } = useUser()

  const convertDateFromISO8601 = (dateString) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
      }`
  }

  const fetchComments = useCallback(async (showCommentCount, firstTime = false) => {
    try {
      const result = await getFeedbacks({
        form: formId,
        field: fieldId,
        take: takeRef.current,
        skip: skipRef.current,
      })
      console.log('result', result)
      if (result?.data) {
        const { data: { formResults }, skip } = result.data
        skipRef.current = skip
        console.log(formResults, skip)

        if (firstTime) {
          takeRef.current = 2 * moreCommentCount
        }
        if (formResults.length) {
          const comments = formResults.map(({ id, name, result, responseTime }) => ({ id, name, content: result, date: convertDateFromISO8601(responseTime) }))
          hidingCommentsRef.current = [...hidingCommentsRef.current, ...comments]
        } else {
          setNoMoreComment(true)
        }
        const commentsToShow = hidingCommentsRef.current.splice(0, showCommentCount)
        console.log(commentsToShow)
        setShowingComments(showingComments => [...showingComments, ...commentsToShow])
      }
    } catch (error) {
      console.log('error', error)
    }
  })

  const loadMoreComments = async () => {
    if (hidingCommentsRef.current.length < moreCommentCount && !noMoreComment) {
      console.log(`need to fetch more feedbacks take:${takeRef.current} skip:${skipRef.current}`)
      fetchComments(moreCommentCount)
    } else {
      const commentsToShow = hidingCommentsRef.current.splice(0, moreCommentCount)
      setShowingComments(showingComments => [...showingComments].concat(commentsToShow))
    }
  }

  const postComment = async (textareaValue) => {
    console.log(`send comment '${textareaValue}' to BE`);
    const date = new Date

    // add comment before sending request
    const newComment = {
      id: uuidv4(), //since no return the real id, randomly generate one
      name: userId,
      content: textareaValue,
      date: convertDateFromISO8601(date)
    }
    setShowingComments(showingComments => [newComment, ...showingComments])
    // send request without error handle
    try {
      const result = await postFeedback({
        name: userId,
        form: formId,
        responseTime: date,
        field: fieldId,
        userFeedback: textareaValue
      })
      console.log('result', result)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchComments(initialCommentCount, true)
  }, [])

  return {
    comments: showingComments,
    noMoreComment,
    loadMoreComments,
    postComment,
  }
}