import React, { useState, useCallback, useEffect, ChangeEvent, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as yup from 'yup'
import api from '../../services/api'
import getIsAuth from '../../services/getIsAuth'
import getValidationErrors from '../../utils/getValidationErrors'
import { maskCPF, removeMaskCPF } from '../../utils/mask'

import Header from '../../components/Header'
import Input from '../../components/Input'
import Loader from '../../components/Loader'

import ImgCellPhone from '../../assets/landing-3.png'
import { toast } from 'react-toastify'
import { AnyObject } from '../../types/utils'
import { UserResponse } from '../../types/user'
import updateReduxState from '../../services/updateReduxState'

const fakePositive = {
  background: 'green'
}


const Landing: React.FC = () => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [cpf, setCpf] = useState('')
  const [cpfMask, setCpfMask] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const history = useHistory()
  const formRef = useRef<FormHandles>(null)

  const [ isFilled, setIsFilled ] = useState(false)

  // Atualiza a mascara do CPF
  useEffect(() => {
    setCpf(removeMaskCPF(cpfMask))
  }, [cpfMask])

  useEffect(() => {
    if ( name.length > 3 &&
      password &&
      confirmPassword &&
      cpf.length === 11 &&
      username &&
      passwordMatch ) setIsFilled(true)
    else setIsFilled(false)
  }, [
    name,
    username,
    password,
    confirmPassword,
    cpf,
    username
  ])

  // Lidar com o registro
  const handleSubmit = useCallback(async (data: AnyObject) => {
    const filteredData: AnyObject = {}

    Object.keys(data).forEach( key => {
      filteredData[key] = data[key].trim()
    })

    setLoading(true)

    try {
      formRef.current?.setErrors({})

      const schema = yup.object().shape({
        cpf: yup.string().min(14, 'Obrigatório ter 11 digitos'),
        username: yup.string().required('Nome de usuário obrigatório '),
        name: yup.string().required('Nome completo obrigatório'),
        password: yup.string().min(6, 'No mínimo 6 digitos'),
        confirmPassword: yup.string().min(6, 'No mínimo 6 digitos')
      })

      await schema.validate(filteredData, {
        abortEarly: false
      })

      if (password !== confirmPassword) {
        return
      }

      const { status } = await api.post('/usuarios', {
        "cpf": cpf,
        "login": username,
        "nome": name,
        "senha": password,
      })

      if (status === 200 || status === 201) {
        const { data } = await api.post<UserResponse>('/login', {
          usuario: username,
          senha: password
        })

        localStorage.setItem('@token_user', data.token)
        localStorage.setItem('@user_name', data.usuario.nome)
        updateReduxState()

        toast.success('Usuário registrado!')
        history.push('/dashboard')
      } else {
        toast.error('Ocorreu algum erro!')
        history.push('/error')
      }
    } catch (err) {
      const errors = getValidationErrors(err)
      formRef.current?.setErrors(errors)
      toast.error('O formulário está incorreto!')
    } finally {
      setLoading(false)
    }
  }, [cpf, username, name, password, confirmPassword, history])

  // Check if user is authenticated
  const handleRedirectToLogin = useCallback(() => {
    const isAuth = getIsAuth()

    if (isAuth) history.push('/dashboard')
    else history.push('/login')
  }, [history])

  const handleSetCpfMask = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCpfMask(
      maskCPF(
        removeMaskCPF(e.target.value)
      )
    )
  }, [])

  const handleSetConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    if (formRef.current?.getFieldRef('password').value?.length
      && formRef.current?.getFieldRef('confirmPassword').value?.length) {
      if (formRef.current?.getFieldRef('password').value !== formRef.current?.getFieldRef('confirmPassword').value) {
        setPasswordMatch(false)
      } else setPasswordMatch(true)
    } else setPasswordMatch(true)
  }

  return (
    <>
      <Header />

      <div>
        <div>
          <div>
            <div>
              <div>
                <p>Gama Bank é um projeto de nossos alunos.
                <span> Já tem conta?</span></p>
              </div>
              <button onClick={handleRedirectToLogin}>Acessar <FaArrowRight /></button>
            </div>

            <div>
              <Form ref={formRef} onSubmit={handleSubmit}>
                <h1> Peça sua conta e cartão de crédito do Gama Bank</h1>
                <Input name="cpf" maxLength={14} value={cpfMask} onChange={handleSetCpfMask} placeholder="Digite seu CPF" />
                <Input name="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Escolha um nome de usuário" />
                <Input name="name" value={name} onChange={e => setName(e.target.value)} placeholder="Nome completo" />
                <Input name="password" value={password} type="password" onChange={e => setPassword(e.target.value)} placeholder="Digite sua senha" />
                <Input name="confirmPassword" value={confirmPassword} type="password" onChange={handleSetConfirmPassword} placeholder="Confirme sua senha" />
                {
                  !passwordMatch ? <span>Senha diferente</span> : null
                }

                {
                  loading
                  ? <Loader />
                  : <button style={ isFilled ? fakePositive : undefined } disabled={!isFilled} type="submit">Continuar<FaArrowRight
                  className={'ArrowRight negative'} /></button>
                }
                {/* <button type="submit">Continuar<FaArrowRight className="ArrowRight" /></button> */}
              </Form>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div>
          <div>
            <div>
              <span>Conta digital do Gama Academy</span>
              <p>Rende mais que a poupança, sem taxa de manutenção nem tarifas escondidas.</p>
            </div>
            <div>
              <span>Cartão de Crédito</span>
              <p>Rende mais que a poupança, sem taxa de manutenção nem tarifas escondidas.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div>
          <div>
            <div>
              <span>Zero anuidade</span>
              <p>Burocracia custa caro. Somos eficientes para você não ter que pagar tarifas.</p>
            </div>
            <div>
              <span>0,00</span>
            </div>
          </div>
        </div>
      </section>


      <section>
        <div>
          <div>
            <div>
              <span>O fim da complexibilidade</span>
              <p>Para quem sabe que tecnologia e design são melhores do que agências e papelada.</p>
            </div>
          </div>
        </div>
      </section>

      <div>
        <div>
          <div>
            <div>
              <span>Simplifique a sua vida. Peça seu convite.</span>
              <p>GamaAcademy Bank Line S.A. - CNPJ 00.000.000/0000-00</p>

              <p>Rua Fictícia, 999 - 00000-000 - São Paulo, SP</p>
              <p>Este é um projeto de avaliação | GamaAcademy | Accenture | 2021</p>
            </div>
            <div>
              <img src={ImgCellPhone} alt="Imagem de um celular" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Landing
