"""Force new migration

Revision ID: dec28take2
Revises: 
Create Date: 2023-12-28 14:57:23.508949

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dec28take2'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('email', sa.String(), unique=True, nullable=False),
        sa.Column('_password_hash', sa.String(), nullable=True),
    )

    op.create_table('application_questions',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('open_ended_questions', sa.String(500)),
        sa.Column('yes_no_questions', sa.String(500)),
        sa.Column('multiple_choice_questions', sa.String(500)),
    )

    op.create_table('answers',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('question_id', sa.Integer(), sa.ForeignKey('application_questions.id'), nullable=False),
        sa.Column('answer', sa.String(500)),
        sa.Column('yes_no_answers', sa.String(500)),
    )

    op.create_table('multiple_choice_answers',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('answer_id', sa.Integer(), sa.ForeignKey('answers.id'), nullable=False),
        sa.Column('choice', sa.String(150)),
    )

    op.create_table('choices',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('question_id', sa.Integer(), sa.ForeignKey('application_questions.id'), nullable=False),
        sa.Column('choice', sa.String(150)),
    )


def downgrade():
    op.drop_table('choices')
    op.drop_table('multiple_choice_answers')
    op.drop_table('answers')
    op.drop_table('application_questions')
    op.drop_table('users')



def downgrade():
    pass
